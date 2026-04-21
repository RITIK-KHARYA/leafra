# Leafra — Architecture, Modules, Control & Data Flow

> Companion to `report.md`. Every bug in `report.md` cites a section here.
> Repo: `RITIK-KHARYA/leafra` · Branch analyzed: `main @ f196d2e` · Stack: Next.js 16 (App Router) · React 19 · Drizzle + Postgres · Pinecone · BullMQ · Better-Auth · UploadThing · AI SDK (DeepSeek).

---

## 1. High-level picture

Leafra is a RAG ("chat with your PDFs") app. A signed-in user creates a "chat" (a workspace), uploads a PDF into it, the PDF is asynchronously parsed / chunked / embedded and stored in Pinecone under a namespace equal to the `chatId`. When the user then sends a question in that chat, the backend embeds the question, queries the Pinecone namespace, feeds top-K chunks as context to DeepSeek, and streams the answer back while persisting both the user and assistant messages in Postgres.

```
┌──────────┐   sign-up/in   ┌─────────────┐    session cookie    ┌──────────────┐
│ Browser  │ ─────────────▶ │ better-auth │ ───────────────────▶ │ Next.js RSC  │
└──────────┘                └─────────────┘                      └──────┬───────┘
      │                                                                 │
      │   POST /api/chat {messages, chatId}                              │
      ├─────────────────────────────────────────────────────────────────▶│
      │                                                                 ▼
      │                                                    ┌──────────────────────┐
      │                                                    │ Rate-limit (Upstash) │
      │                                                    │ ensureChatOwnership  │
      │                                                    │ Pinecone query (NS)  │
      │                                                    │ DeepSeek streamText  │
      │                                                    │ createMessage() × 2  │
      │                                                    └──────────────────────┘
      │
      │   UploadThing /api/uploadthing (pdfUploader)
      ├──────────────────▶  Middleware: auth + chat ownership
      │                     onUploadComplete:
      │                        • enqueue BullMQ "upload-pdf" job (if Redis TCP)
      │                        • updateFile(chatId, ufsUrl, name)
      │
      │                    ┌────────────────────── BullMQ worker (lib/worker.ts) ──────────────────┐
      │                    │ fetch PDF → WebPDFLoader → split → PremEmbeddings → Pinecone.upsert  │
      │                    └───────────────────────────────────────────────────────────────────────┘
```

---

## 2. Directory map (source of truth)

```
app/
  api/
    auth/[...all]/route.ts       # Better-auth Next handler, lazy-loaded
    chat/route.ts                # POST /api/chat   (streamText + Pinecone)
    messages/route.ts            # GET  /api/messages?chatId=
    uploadthing/core.ts          # UploadThing FileRouter (pdfUploader)
  actions/                       # Next "server actions"
    chat/create.ts | delete.ts | get.ts
    file/get.ts   | update.ts
    message/create.ts | get.ts
  chat/
    [id]/page.tsx                # Chat UI (useChat + MessageList + PdfUpload)
    [id]/layout.tsx
    types/index.ts               # DbMessage, ApiResponse<T>
  components/
    HomePage.tsx, JsonLd.tsx, WebVitals.tsx,
    NotFoundClient.tsx, uploadthing-provider.tsx
  dashboard/page.tsx             # List of chats (TanStack Query → getChats())
  signin/page.tsx | signup/page.tsx
  how-to-use/ features/ glossary/ privacy/ terms/ pricing/ support/
  layout.tsx  page.tsx  not-found.tsx  globals.css
  index.ts                       # orphan bootstrap (see §8)
  providers/queryprovider.tsx

actions/session.ts               # orphan (uses client getSession on server)

components/
  chats.tsx                      # <Chatcard />
  example-upload.tsx             # UploadThing <UploadButton /> + preview iframe
  custom/  newChatbtn.tsx sign-in.tsx sign-up.tsx pdf-upload.tsx
           pdf-viewer.tsx landingheader.tsx footer.tsx landinggrid.tsx
           BentoGrid.tsx Header.tsx spiral.tsx ContentPageLayout.tsx
  event/MessageList.tsx
  layout/AppHeader.tsx NavUser.tsx
  nav-main.tsx nav-projects.tsx nav-secondary.tsx nav-user.tsx
  ui/*                           # shadcn primitives + app-sidebar.tsx

lib/
  auth.ts             # betterAuth({ drizzleAdapter, socialProviders?, session })
  auth-client.ts      # createAuthClient + signIn/signUp wrappers
  db.ts               # pg Pool + drizzle(pool)
  db/schema.ts        # user, chat, messages, session, account, verification
  db/transactions.ts  # withTransaction, withRetry
  env.ts              # Zod envSchema + lazy Proxy
  errors/index.ts     # AppError, Authorization/Validation/NotFound/DatabaseError
  api-response.ts     # ApiResponse.{success,error,unauthorized,...}
  logger.ts           # level-aware logger
  rate-limit.ts       # RateLimiter + chat/upload/api limiters
  constants.ts        # priorityEmojis, workSections
  seo/glossary-data.ts
  services/
    ai/prompts.ts                 # getSystemPrompt(context, question)
    auth/chat-authorization.ts    # ensureChatOwnership, getChatWithOwnership
    vector/pinecone.ts            # re-export
  integrations/
    pinecone.ts                   # getPineconeClient, getResultFromQuery
    redis.ts                      # Upstash REST client (health-checked)
  worker.ts           # BullMQ Worker("upload-pdf")

drizzle/0000_low_cobalt_man.sql   # initial migration
drizzle.config.ts
next.config.ts                    # cacheComponents: true, image host utfs.io
proxy.ts                          # "middleware" — see §7
tsconfig.json                     # strict:false, module:commonjs
package.json
credentials.json                  # ⚠ see report.md bug-4
```

---

## 3. Data model (`lib/db/schema.ts`)

| Table          | PK                | Important columns / FK                                                           | Indexes |
|----------------|-------------------|----------------------------------------------------------------------------------|---------|
| `user`         | `id text`         | `email unique`, `name`, `image`, `emailVerified`                                 | —       |
| `chat`         | `id text`         | `title`, `description`, `value` (priority), `userId → user.id ON DELETE CASCADE`, `pdfUrl`, `pdfName`, `pdfSize` | `chat_user_id_idx`, `chat_created_at_idx` |
| `messages`     | `id serial`       | `chatId → chat.id ON DELETE CASCADE`, `content`, `role: userSystemEnum('system','user')` | `messages_chat_id_idx`, `messages_created_at_idx` |
| `session`      | `id text`         | `token unique`, `expiresAt`, `userId → user.id`                                  | —       |
| `account`      | `id text`         | `providerId`, `accountId`, `password`, tokens                                    | —       |
| `verification` | `id text`         | `identifier`, `value`, `expiresAt`                                               | —       |

Relational invariants:
* A chat belongs to exactly one user. Deleting a user cascades all their chats.
* Messages belong to one chat. Role is strictly `"user"` or `"system"` — there is **no `"assistant"`** value in the enum (relevant for §5 and report.md bug-8).

---

## 4. Environment & configuration (`lib/env.ts`)

`env` is a lazy-validated Zod proxy; any access triggers `envSchema.parse(process.env)` once.

Declared fields:
* `DATABASE_URL` (url, required)
* `PINECONE_API_KEY` (required)
* `PREM_API_KEY` (required)  ← *only* embedding key in the schema
* `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` (optional)
* `GOOGLE_*`, `GITHUB_*`, `DISCORD_*` OAuth pairs (optional)
* `NEXT_PUBLIC_BASE_URL` (optional, default = prod Vercel url in prod else localhost)
* `NODE_ENV`

**Undeclared but used in code** (see report.md bugs 2, 13):
* `GEMINI_AI_API_KEY` — read in `lib/integrations/pinecone.ts:20`
* `DEEPSEEK_API_KEY` — read in `app/api/chat/route.ts:25`
* `NEXT_PUBLIC_APP_URL` — read in `lib/auth-client.ts:8`

Any first access to `env.GEMINI_AI_API_KEY` / `env.DEEPSEEK_API_KEY` triggers the proxy's `validateEnv()` and returns `undefined` (they aren't on `envSchema` so the Zod parse simply doesn't include them; the `get` proxy returns `validatedEnv[prop]` → `undefined`). The providers then silently construct with `apiKey: undefined` and fail at request time with an auth error instead of a clear env-missing error.

---

## 5. Authentication & authorization

### 5.1 Server (`lib/auth.ts`)
* `betterAuth` with `drizzleAdapter(db, { provider: "pg", schema: {user, session, account, verification} })`.
* `emailAndPassword.enabled = true`, `minPasswordLength = 8`.
* Social providers are **conditionally registered** — only included if both `CLIENT_ID` and `CLIENT_SECRET` are set.
* `session`: 7-day expiry, 24-hour rolling `updateAge`, 5-minute cookie cache.
* Rate limiting explicitly commented out (see `// rateLimit: { ... }` block at lines 65–68).
* `baseURL: env.NEXT_PUBLIC_BASE_URL`.

### 5.2 Next handler (`app/api/auth/[...all]/route.ts`)
Lazy-loads `auth` from `lib/auth` once, caches the `toNextJsHandler` so that concurrent requests don't re-initialize. GET and POST both delegate.

### 5.3 Client (`lib/auth-client.ts`)
Exports `signIn`, `signUp`, `useSession`, `getSession`, `signOut`, `$Infer`, plus convenience wrappers:
* `signInWithGithub/Discord/Google` — correctly call `signIn.social({...})`.
* `signUpWithGithub/Discord/Google` — **also call `signIn.social({...})`** instead of `signUp.social(...)`. See report.md bug-1.
* `baseURL` is resolved from `window.location.origin` on the client and `NEXT_PUBLIC_APP_URL ?? fallback` on the server. The schema declares `NEXT_PUBLIC_BASE_URL`, not `NEXT_PUBLIC_APP_URL` → drift.

### 5.4 Route-level ownership (`lib/services/auth/chat-authorization.ts`)
`ensureChatOwnership(chatId, userId)`:
1. `select id,userId from chat where id=chatId limit 1`.
2. If empty → `NotFoundError`. If `userId` mismatch → `AuthorizationError(403)`. Any other DB error → `AuthorizationError(500)`.

Used consistently by:
* `POST /api/chat` (line 121)
* `GET /api/messages` (line 39)
* `deleteChat` server action
* `pdfUploader.onUploadComplete` (line 95)

`getChatWithOwnership` exists but is never called.

### 5.5 Route gate (`proxy.ts`)
Reads the better-auth cookie via `getSessionCookie(request)` and:
* `/` + cookie → redirect `/dashboard`.
* No cookie on `/dashboard` or `/chat/...` → redirect `/signup`.
* Exports `config.matcher = ["/", "/dashboard", "/chat/:path*", "/dashboard/chat/:path*"]`.

**BUT**: the file is named `proxy.ts` and exports a function called `proxy`. Next.js only recognizes `middleware.ts` (or `src/middleware.ts`) exporting a `middleware` function. So **none of this route-gate logic actually runs**. See report.md bug-7.

---

## 6. Chat control flow (happy path)

### 6.1 Create a chat
`components/custom/newChatbtn.tsx` → `Newchatform.onSubmit` →
`app/actions/chat/create.ts :: createChat(input)`:
1. `getSession()` (server-side better-auth).
2. `userId = input.userid?.id || session.user.id`.
3. `crypto.randomUUID()` → `db.insert(chat).values({id, title, description, value, userId})`.
4. Re-select the inserted row, return `{data, success, status:200}`.
5. React-Query `invalidateQueries(["chats"])` → dashboard refetches.

### 6.2 List chats
`app/dashboard/page.tsx` uses `useQuery(["chats"], getChats)` (`app/actions/chat/get.ts`).
Important detail: `getChats()` returns `status: 404, error: "No chats found"` for the empty case (not an error). The dashboard reads `res.data || []` so this degrades silently, but the status code is semantically wrong (see report.md bug-10).

### 6.3 Open a chat
`components/chats.tsx :: Chatcard` renders `<Link href={`/chat/${id}`}>`.

### 6.4 Chat page (`app/chat/[id]/page.tsx`)
* On mount: `fetchMessages()` → `GET /api/messages?chatId=...`.
* `useChat({ id, transport: new DefaultChatTransport({ api:"/api/chat", body:{chatId} }) })` from `@ai-sdk/react`.
* After each DB fetch, builds `initialMessages: UIMessage[]` from `DbMessage[]` mapping `role: "system" ⇒ "assistant"` (because `@ai-sdk/react` UIMessage role is `"user" | "assistant" | "system"` but the UI tags assistant output with role assistant; see §5.5 enum story).
* An effect diff-syncs `initialMessages` into `useChat.setMessages` when the DB returns new IDs — this effect includes `messages` in its dep array which is known to oscillate (see report.md bug-9).
* Submitting the form calls `sendMessage({ role:"user", parts:[{type:"text", text}] })` which posts to `/api/chat`.

### 6.5 `POST /api/chat` (`app/api/chat/route.ts`)
1. `auth.api.getSession(...)` → 401 if missing.
2. `chatRateLimiter.check(userId)` (10 req / 60 s; fail-open on Redis error).
3. `chatRequestSchema.safeParse(body)` — `messages: MessageSchema[]`, `chatId: uuid`.
4. `ensureChatOwnership(chatId, userId)`.
5. Extract last-message content from `content` or `parts[].text|content`.
6. `context = await getResultFromQuery(messageContent, chatId)` (fallback `"No context available"`).
7. Build `transformedMessages` filtered to non-empty content.
8. `streamText({ model: deepseek("deepseek-chat"), system: getSystemPrompt(context, messageContent), messages: transformedMessages, experimental_transform: smoothStream({...}), onFinish: save assistant msg as role="system" (retry×3) })`.
9. Save user msg (role `"user"`) before returning the stream.
10. `return result.toUIMessageStreamResponse()`.

### 6.6 `GET /api/messages`
Auth → validate uuid → `ensureChatOwnership` → `getMessages(chatId)` → `ApiResponse.success(messages || [])`.
`getMessages` currently does **not** `ORDER BY created_at` (see report.md bug-11).

---

## 7. PDF ingestion pipeline

### 7.1 UploadThing router (`app/api/uploadthing/core.ts`)
* `pdfUploader`: `pdf`, max 8MB, max 1 file, `input: z.object({ chatId: uuid() })`.
* `.middleware()`: calls better-auth; returns `{userId, chatId}`.
* `.onUploadComplete()`:
  * Build BullMQ `Queue("upload-pdf")` only if `UPSTASH_REDIS_REST_URL` is *not* an http(s) URL (because BullMQ needs TCP, Upstash REST is HTTPS). The current config uses HTTPS so `queue === null` and the job is never enqueued — it just logs "queue unavailable". The DB update still runs.
  * `ensureChatOwnership(chatId,userId)` (swallows errors, still returns success to UploadThing).
  * `updateFile(chatId, file.ufsUrl, file.name)` — **does not persist `file.size` into `pdfSize`**; see report.md bug-12.

### 7.2 Client uploader (`components/example-upload.tsx`)
* On mount fetches existing `pdfUrl` via `getFile(chatId)`.
* `UploadButton` with `input={{chatId}}` (cast with `@ts-expect-error` because generated types lack the `input` field).
* On success: sets preview immediately to `res[0].url`, then after 800 ms re-fetches via `getFile` to sync with whatever the server persisted.

### 7.3 Worker (`lib/worker.ts`)
* `getRedisConnection()` parses `UPSTASH_REDIS_REST_URL`, hardcodes `port: 6379`, uses `UPSTASH_REDIS_REST_TOKEN` as password. Unlike the UploadThing route, it does **not** early-return when the URL is an https(s) REST endpoint — so with Upstash REST it attempts to open a TCP connection that will never succeed (see report.md bug-5).
* Embeddings: `PremEmbeddings({ apiKey: env.PREM_API_KEY, model: "@cf/baai/bge-small-en-v1.5" })` → dense vectors of dimension 384.
* Flow per job:
  1. `fetch(fileUrl)` using `node-fetch` v3, then `response.buffer()`. In node-fetch v3 this method is removed; v2 retains it. `package.json` lists nothing for `node-fetch`, so the version is whatever transitively resolved — see report.md bug-14.
  2. `new WebPDFLoader(blob, { splitPages:true })` → rawDocs.
  3. `RecursiveCharacterTextSplitter({chunkSize:1000, chunkOverlap:200})`.
  4. Map each doc: `id = \`${fileUrl}-${doc.metadata.loc.pageNumber}-${idx}\``, `values = embeddings.embedQuery(...)` ; **assumes `doc.metadata.loc.pageNumber` always exists** — see report.md bug-3.
  5. `namespace = pineconeIndex.namespace(job.data.chatId)` → `namespace.upsert(vectors)`.

### 7.4 Pinecone query (`lib/integrations/pinecone.ts`)
* Reads `env.GEMINI_AI_API_KEY` — undeclared in env schema (see §4 / report.md bug-2).
* Constructs `GoogleGenerativeAIEmbeddings({ model: "gemini-2.5-flash", taskType: RETRIEVAL_DOCUMENT })`. Gemini 2.5 Flash is a *chat completion* model, **not an embedding model** — real Gemini embedding models are `text-embedding-004` / `embedding-001` (dim 768) (see report.md bug-6).
* `getResultFromQuery(query, chatId)`:
  1. `index("leafravectordb").namespace(chatId)`.
  2. `embeddedQuery = embeddingAI.embedQuery(query)`.
  3. `namespace.query({ vector: embeddedQuery, topK:3, includeMetadata:true, includeValues:true })`.
  4. Filter `match.score > 0.5`, take `match.metadata?.content as string`, join with `\n\n`.
  5. Return string or `"No results found"`.

**Critical data-flow invariant violation:** vectors are *written* by the worker (PremEmbeddings, 384-dim) and *queried* by the API route (GoogleGenerativeAIEmbeddings, ≥768-dim even if the model actually produced embeddings). Even if Gemini 2.5 Flash could embed, the dimensions would not match Pinecone's index, and semantic similarity between write and read paths would be meaningless. RAG is effectively broken. See report.md bug-6.

---

## 8. Orphan / dead / misplaced code

* `app/index.ts` — standalone `main()` that creates a drizzle instance and exits. Runs on import (bottom `main()` call). Harmless but misleading.
* `actions/session.ts` — imports **client** `getSession` and calls it in a server default-export named `Session()`. Never used anywhere.
* `app/api/chat/route.ts` imports `getChats` but never calls it.
* `app/api/uploadthing/core.ts` imports `useSonner` from `sonner` — not an export of `sonner` (only `toast`/`Toaster` exist). It's unused but present at module top (see report.md bug-15).
* `lib/services/vector/pinecone.ts` is a 4-line re-export of `lib/integrations/pinecone.ts`.
* `components/custom/Header.tsx` and `components/layout/AppHeader.tsx` are duplicates.
* `components/nav-*.tsx` duplicates of `components/layout/Nav*.tsx` (and `app-sidebar.tsx` imports the top-level ones).

---

## 9. Rate limiting, errors, responses

* `RateLimiter` (`lib/rate-limit.ts`) uses Upstash REST: `redis.get<number>`, `redis.incr`, `redis.expire`. If Redis isn't configured or fails, it fails **open** (returns `success:true`) with a warning — an intentional design choice.
* Errors (`lib/errors/index.ts`): `AppError` → `AuthorizationError(403)`, `NotFoundError(404)`, `ValidationError(400)`, `DatabaseError(500)`.
* `ApiResponse` helpers wrap `NextResponse.json({...}, {status})` with standard shape `{data?, error?, statusCode}`.

---

## 10. UI layer summary

* **Landing**: `app/page.tsx` → `HomePage.tsx` + `landingheader.tsx` + `BentoGrid.tsx` + `footer.tsx`.
* **Dashboard**: `app/dashboard/page.tsx` with `SidebarProvider`, `AppSidebar`, `NewchatBtn`, `Chatcard`.
* **Chat**: `app/chat/[id]/page.tsx` (explained §6.4). PDF side pane is `PdfUpload` → `ExampleUpload`.
* **Auth**: `components/custom/sign-in.tsx`, `components/custom/sign-up.tsx`.
  * `SignIn` has **no password field**; `handleEmailSignIn` calls `signIn.email({email, password:""})`. See report.md bug-16.
  * `SignUp` collects email + password + confirmPassword and calls `signUp.email({..., callbackURL:"/dashboard"})` — works. But it also wires `signUpWithGoogle/Discord/Github` → broken §5.3 wrappers.
* **PDF viewer**: `components/custom/pdf-viewer.tsx` is a static placeholder (not wired up — not a bug per se, but the UI under `TabsContent value="files"` in the chat page shows `"Quiz section coming soon..."`).

---

## 11. Build / type-safety posture

* `tsconfig.json`: `strict:false`, `module:"commonjs"` inside a Next 16 / React 19 project. Strictness off hides a number of real issues (e.g. `doc.metadata.loc.pageNumber`, `part.text || part.content`, the `userid` shape in `NewChatInput`).
* `next.config.ts` sets `cacheComponents: true`. That is why `app/layout.tsx` calls `unstable_noStore()` (to allow `performance.now()` in the render path).
* `dev:worker` script: `tsc --watch ./lib/worker.ts && bunx nodemon ./lib/worker.js` — `&&` will never advance past the watcher; the intended flow is two separate terminals (README gets this right).
* `credentials.json` is committed to the repo (report.md bug-4).

---

## 12. Sequence diagram — "user asks a question"

```
UI (chat/[id]/page.tsx)
   │ sendMessage({role:"user", parts:[...]})
   ▼
POST /api/chat
   │ auth.api.getSession
   │ chatRateLimiter.check
   │ zod safeParse(chatRequestSchema)
   │ ensureChatOwnership
   │ getResultFromQuery(lastMessage, chatId)  ──▶ Pinecone("leafravectordb").ns(chatId).query({vector, topK:3})
   │ streamText({system: getSystemPrompt(context, msg), messages, model: deepseek})
   │    onFinish: withRetry(createMessage(chatId, text, "system"))
   │ createMessage(chatId, userMsg, "user")
   │ result.toUIMessageStreamResponse()
   ▼
UI consumes stream via @ai-sdk/react  useChat; after stream completes an
effect refetches /api/messages to reconcile with DB ordering.
```

And "upload a PDF":

```
UI (ExampleUpload.UploadButton)
   │ input={{chatId}}
   ▼
UploadThing edge → core.ts.middleware (auth) → file uploaded to UT CDN
   │
   ▼
onUploadComplete
   ├─ queue?.add("upload-pdf", {fileUrl, userId, chatId})   (only if TCP Redis)
   ├─ ensureChatOwnership
   └─ updateFile(chatId, file.ufsUrl, file.name)            (no pdfSize)
   
                         BullMQ Worker (lib/worker.ts)
                                 │ fetch(fileUrl)
                                 │ WebPDFLoader → split
                                 │ PremEmbeddings.embedQuery(chunk)   ◀── dim=384
                                 │ pineconeIndex.namespace(chatId).upsert(vectors)
                                 ▼
                         Pinecone leafravectordb/<chatId>

# Later when user asks a question:
API /api/chat → getResultFromQuery → embeddingAI.embedQuery(...) 
               (GoogleGenerativeAIEmbeddings, model="gemini-2.5-flash")  ◀── incompatible
               → pinecone ns(chatId).query(...)
```

The two embedding boxes are labelled "incompatible" on purpose — see report.md bug-6.

---

## 13. Cross-reference index (used by `report.md`)

| Anchor  | Where it lives in this file | Symbols                                                      |
|---------|-----------------------------|--------------------------------------------------------------|
| §4      | Environment & configuration | `env`, `envSchema`, `GEMINI_AI_API_KEY`, `DEEPSEEK_API_KEY`, `NEXT_PUBLIC_APP_URL` |
| §5.3    | Client auth wrappers        | `signUpWithGithub`, `signUpWithDiscord`, `signUpWithGoogle`  |
| §5.5    | Route gate                  | `proxy.ts` / `middleware`                                    |
| §6.2    | Dashboard list              | `getChats`                                                   |
| §6.4    | Chat page effects           | `useChat`, `setMessages`, `initialMessages`                  |
| §6.5    | `/api/chat`                 | `streamText`, `createMessage(...,"system")`                  |
| §6.6    | `/api/messages`             | `getMessages`                                                |
| §7.1    | UploadThing router          | `pdfUploader`, `useSonner` import                            |
| §7.2    | `updateFile`                | `pdfSize` not persisted                                      |
| §7.3    | Worker                      | `getRedisConnection`, `response.buffer()`, `doc.metadata.loc.pageNumber` |
| §7.4    | Pinecone integration        | `GoogleGenerativeAIEmbeddings`, `gemini-2.5-flash`           |
| §8      | Orphans                     | `app/index.ts`, `actions/session.ts`, `lib/services/vector/pinecone.ts` |
| §10     | Auth UI                     | `SignIn.handleEmailSignIn({password:""})`, `discordd.png`    |
| §11     | Build posture               | `strict:false`, `credentials.json`                           |
