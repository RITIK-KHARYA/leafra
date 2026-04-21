# Leafra API Reference

Complete inventory of HTTP routes, server actions, and their contracts.
Authentication is [better-auth](https://www.better-auth.com/) session cookies on every protected surface.

**Base URL:** `env.NEXT_PUBLIC_BASE_URL` (defaults to `http://localhost:3000`)

---

## Conventions

### Success envelope — `ApiResponse.success<T>`
```json
{ "data": T, "message": string | undefined, "statusCode": 200 }
```

### Error envelope — `ApiResponse.error`
```json
{ "error": string, "details": unknown | undefined, "statusCode": number }
```

### Status codes
| Code | Helper                     | Meaning |
| ---- | -------------------------- | ------- |
| 200  | `ApiResponse.success`      | OK, body in `data` |
| 400  | `ApiResponse.badRequest`   | Zod validation failure (`details` carries field errors) |
| 401  | `ApiResponse.unauthorized` | No session or expired cookie |
| 403  | `ApiResponse.error(…,403)` | Authenticated but not the chat owner |
| 404  | `ApiResponse.notFound`     | Chat / resource doesn't exist |
| 429  | `ApiResponse.error(…,429)` | Rate-limit bucket exceeded |
| 500  | `ApiResponse.error`        | Unhandled exception / DB failure |

### Auth & authorization
Every protected endpoint calls `auth.api.getSession({ headers })`. Ownership is
enforced via `ensureChatOwnership(chatId, userId)` which performs one SELECT
with an exact `chat.user_id === session.user.id` equality check and throws
`NotFoundError` / `AuthorizationError` that the API handler maps to 404 / 403.

### Rate limits (Upstash Redis, sliding window)
| Limiter              | Prefix                | Req / 60s |
| -------------------- | --------------------- | --------- |
| `chatRateLimiter`    | `ratelimit:chat`      | 10        |
| `uploadRateLimiter`  | `ratelimit:upload`    | 5         |
| `apiRateLimiter`     | `ratelimit:api`       | 20        |

Fail-open: if Redis is unreachable, the request is allowed and a warning is logged.

---

## HTTP routes

### `POST /api/chat`
Streaming chat turn. Validates ownership, looks up the Pinecone namespace for
the chat, builds an injection-hardened system prompt, streams DeepSeek, and
persists both the user turn (pre-stream) and the assistant turn (on `onFinish`).

- **Auth**: session required
- **Rate limit**: `chatRateLimiter` on `session.user.id`
- **Request body (`chatRequestSchema`)**
  ```ts
  {
    chatId: string; // uuid
    messages: Array<{
      role: "user" | "assistant" | "system";
      content?: string;
      parts?: Array<{ type: string; text?: string; content?: string }>;
      id?: string;
    }>; // min length 1; last message must be extractable
  }
  ```
- **Response**: `ReadableStream` (AI SDK v5 UIMessage stream), or JSON error envelope
- **Errors**: 400 (invalid schema), 401, 403, 404, 429, 500
- **Side effects**:
  - Inserts `messages` row `{ role: "user",   content: lastMessage }` before streaming
  - Inserts `messages` row `{ role: "system", content: streamText }` in `onFinish` via `withRetry(3, 100ms)`
  - Queries Pinecone index `leafravectordb` in namespace `chatId`
- **DB "system" is assistant**: history is remapped via `msg.role === "user" ? "user" : "assistant"` before being sent to DeepSeek. <ref_snippet file="/home/ubuntu/leafra/app/api/chat/route.ts" lines="174-201" />

### `GET /api/messages?chatId=<uuid>`
Return full message history for a chat, ordered by `(createdAt asc, id asc)`.

- **Auth**: session required
- **Ownership**: `ensureChatOwnership` (403 if not owner, 404 if missing)
- **Response 200**:
  ```ts
  ApiSuccess<Array<{
    id: number;
    chatId: string;
    content: string;
    createdAt: string; // ISO
    role: "user" | "system";
  }>>
  ```
- **Response 200 empty**: `ApiResponse.success([])` when `chatId` is absent (intentional — lets the chat page render without a noisy 400)
- **Errors**: 400 (bad uuid), 401, 403, 404, 500

### `GET /api/auth/[...all]` · `POST /api/auth/[...all]`
Catch-all better-auth handler. Delegates to `toNextJsHandler(auth)`. The handler
is loaded lazily once and cached behind a singleton promise to avoid multiple
initializations across a cold-start burst.

### `POST /api/uploadthing`
UploadThing file router. Single route: `pdfUploader`.

- **Input**: `{ chatId: string (uuid) }`
- **File constraints**: `application/pdf`, 1 file, ≤ 8 MB
- **Middleware**: requires session; returns `{ userId, chatId }` as metadata
- **`onUploadComplete`** (server-side only):
  1. Re-verify `ensureChatOwnership` (403/404 short-circuit, no queue side effect)
  2. `purgePreviousVectors(chatId)` — `pinecone.index("leafravectordb").namespace(chatId).deleteAll()` (404 treated as no-op)
  3. Enqueue BullMQ job `upload-pdf` with `{ fileUrl, userId, chatId }` if TCP Redis is configured
  4. `updateFile(chatId, pdfUrl, pdfName, pdfSize)` — DB update always runs even if queue is down
- **Returns**: `{ uploadedBy: userId }`

### `GET /sitemap.xml` · `GET /robots.txt`
Static-prerendered Next.js file routes (SEO). No auth.

### Static marketing / auth pages
`/`, `/signin`, `/signup`, `/dashboard`, `/chat/[id]`, `/features`, `/pricing`,
`/glossary`, `/glossary/[term]`, `/how-to-use`, `/support`, `/privacy`, `/terms` —
partial prerender under Next.js 16 `cacheComponents`.

---

## Server actions (`"use server"`)

### `createChat(input: NewChatInput)` — `app/actions/chat/create.ts`
- **Input** (`newChatSchema`): `{ chatName, description, priority, workSection }`
- **Notes**: `workSection` is **collected but silently dropped** (no column).
  Relevant for JSONB refactor below.
- **Side effects**: inserts one `chat` row, returns the row
- **Returns**: `{ data: chat, status: 200 } | { error, status: 401|500 }`

### `getChats()` — `app/actions/chat/get.ts`
- **Auth**: session required
- **Query**: `SELECT … FROM chat WHERE user_id = $1 ORDER BY created_at` (uses index `chat_user_id_idx`)
- **Returns**: `{ data: ChatRow[], status: 200 | 401 | 500 }`

### `getSession()` — `app/actions/chat/get.ts`
Thin wrapper around `auth.api.getSession({ headers })` that returns `null` instead of throwing.

### `deleteChat(chatId: string)` — `app/actions/chat/delete.ts`
- **Auth + ownership** required
- **Cascades**: `messages` FK uses `onDelete: "cascade"`, so deleting a chat drops its messages.
- **No UI caller** — action is wired but dashboard has no delete button (future work).

### `getFile(chatId: string)` — `app/actions/file/get.ts`
- **No auth check** — intended for internal use (UI calls it after the chat page has already gated access).
- **Returns**: `{ success, data: { pdfUrl, pdfName, pdfSize } } | { error }`

### `updateFile(chatId, pdfUrl, pdfName, pdfSize?)` — `app/actions/file/update.ts`
- **Side effect**: updates `chat.pdf_url`, `chat.pdf_name`, and optionally `chat.pdf_size`
- **Throws** if `rowCount === 0` (chat missing)
- Called only from the UploadThing `onUploadComplete` hook

### `createMessage(chatId, message, role: "user" | "system")` — `app/actions/message/create.ts`
- Inserts one `messages` row
- Wraps errors in `DatabaseError` with `originalError` attached

### `getMessages(chatId)` — `app/actions/message/get.ts`
- Returns all rows for a chat ordered by `(created_at asc, id asc)`
- Backs `GET /api/messages`

---

## Database schema summary

| Table         | Primary key | Notable columns                                                                 | Indexes                                     |
| ------------- | ----------- | ------------------------------------------------------------------------------- | ------------------------------------------- |
| `user`        | `id` text   | `email uniq`, `emailVerified bool`                                              | implicit (PK, unique)                       |
| `chat`        | `id` text   | `title`, `description`, `value` (priority), `userId FK`, `pdfUrl/Name/Size`      | `chat_user_id_idx`, `chat_created_at_idx`   |
| `messages`    | `id` serial | `chatId FK (cascade)`, `content`, `role enum(system,user)`                      | `messages_chat_id_idx`, `messages_created_at_idx` |
| `session`     | `id` text   | `userId FK (cascade)`, `token uniq`, `expiresAt`                                | PK + uniq                                   |
| `account`     | `id` text   | `providerId`, `accountId`, `scope text (comma-sep)`, `userId FK`                | PK                                          |
| `verification`| `id` text   | `identifier`, `value`, `expiresAt`                                              | PK                                          |

External stores:

- **Pinecone** index `leafravectordb`, one namespace per `chatId`. Vector metadata: `{ pageNumber: number, content: string }`.
- **Upstash Redis** (BullMQ queue `upload-pdf`, plus the rate-limit counters).

---

## Pinecone / RAG contract

`getResultFromQuery(q, chatId)` — `lib/integrations/pinecone.ts`
1. Embeds `q` (see note in `report.md` on read/write embedding mismatch)
2. Queries `leafravectordb` namespace `chatId` for top-K matches
3. Returns concatenated `metadata.content` as the context string

The worker (`lib/worker.ts`) listens on the `upload-pdf` BullMQ queue and writes
384-dim PremEmbeddings vectors into the same namespace. **Read/write embedding
mismatch (bugs #3 / #6) is still deferred.**

---

## OpenAPI-style matrix

| Method | Path                       | Auth | Rate limit        | 200 body                     | 400 | 401 | 403 | 404 | 429 | 500 |
| ------ | -------------------------- | :--: | ----------------- | ---------------------------- | :-: | :-: | :-: | :-: | :-: | :-: |
| POST   | /api/chat                  |  ✓   | `chatRateLimiter` | AI SDK stream                |  ✓  |  ✓  |  ✓  |  ✓  |  ✓  |  ✓  |
| GET    | /api/messages              |  ✓   | —                 | `Array<messages>`            |  ✓  |  ✓  |  ✓  |  ✓  |  —  |  ✓  |
| POST   | /api/uploadthing           |  ✓   | UT quotas         | `{ uploadedBy }`             |  ✓  |  ✓  |  ✓  |  ✓  |  —  |  ✓  |
| ALL    | /api/auth/[...all]         |  —   | —                 | better-auth response         |  —  |  —  |  —  |  —  |  —  |  —  |

---

## Versioning / compatibility

The chat request schema accepts both legacy `content: string` messages **and**
AI SDK v5 `parts: Array<{type,text}>`. The server always normalizes to a
`{role, content}` pair before calling DeepSeek. This keeps the chat page (which
uses `@ai-sdk/react` `useChat`) compatible with any clients that still post
the v4 shape.

The read path for `GET /api/messages` always returns the DB-native shape
`{ id, chatId, content, createdAt, role }`. The chat page transforms this
into `UIMessage` via `msg.role === "system" ? "assistant" : "user"`
(see <ref_snippet file="/home/ubuntu/leafra/app/chat/[id]/page.tsx" lines="24-35" />).
