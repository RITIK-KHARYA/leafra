# Leafra — Bug Report

Companion to `understanding.md`. Every bug below cites a file + line, the exact cause, the blast radius, and the minimal fix.
Base commit: `main @ f196d2e`.

## Summary

| #  | Sev      | Area        | File                                       | One-liner                                                              |
|----|----------|-------------|--------------------------------------------|------------------------------------------------------------------------|
|  1 | Critical | Auth        | `lib/auth-client.ts:26`                    | OAuth **sign-up** wrappers call `signIn.social`                        |
|  2 | Critical | Config      | `lib/env.ts` vs `pinecone.ts`, `chat/route.ts` | `GEMINI_AI_API_KEY`, `DEEPSEEK_API_KEY` used but not in Zod schema |
|  3 | Critical | RAG         | `worker.ts` ⇄ `integrations/pinecone.ts`   | Write path embeds with Prem, read path with Google → dim mismatch      |
|  4 | Critical | Security    | `credentials.json`                         | Real GCP service-account private key committed                         |
|  5 | Critical | Infra       | `lib/worker.ts:29`                         | Worker tries TCP to Upstash REST URL (producer rejects it, worker doesn't) |
|  6 | Critical | RAG         | `integrations/pinecone.ts:19`              | `gemini-2.5-flash` is not an embedding model                           |
|  7 | Critical | Routing     | `proxy.ts`                                 | File must be `middleware.ts` — current gate is dead code               |
|  8 | Critical | Auth        | `components/custom/sign-in.tsx:24`         | Email sign-in always sends `password: ""` (no password input)          |
|  9 | High     | UI          | `chat/[id]/page.tsx:104`                   | Sync `useEffect` has `messages` in deps → oscillation                  |
| 10 | Medium   | API         | `app/actions/chat/get.ts:58`               | Empty collection returned as HTTP 404                                  |
| 11 | High     | API         | `app/actions/message/get.ts:10`            | `getMessages` has no `ORDER BY`                                        |
| 12 | Medium   | DB          | `file/update.ts` ⇄ `uploadthing/core.ts:130` | `pdfSize` never persisted                                            |
| 13 | Medium   | Config      | `auth-client.ts:8` vs `env.ts:30`          | Reads `NEXT_PUBLIC_APP_URL`, schema declares `NEXT_PUBLIC_BASE_URL`    |
| 14 | Medium   | Infra       | `lib/worker.ts:92`                         | `response.buffer()` removed in node-fetch v3                           |
| 15 | Low      | Lint        | `app/api/uploadthing/core.ts:5`            | `useSonner` not exported by `sonner`                                   |
| 16 | Low      | Asset       | `components/custom/sign-up.tsx:129`        | `discordd.png` (typo, not under `/public`)                             |
| 17 | Medium   | Infra       | `lib/worker.ts:113`                        | `doc.metadata.loc.pageNumber` accessed without null check              |
| 18 | Low      | Dead code   | `actions/session.ts`                       | Uses client `getSession` server-side; redirects to non-existent `/sign-in` |
| 19 | Low      | UX          | `components/custom/newChatbtn.tsx:91`      | After create, doesn't navigate to new chat                             |
| 20 | Low      | Dead code   | `app/index.ts`                             | Orphan `main()` leaking a `Pool`                                       |
| 21 | Low      | Tooling     | `package.json:7`                           | `dev:worker` chained with `&&` (tsc watch never exits)                 |
| 22 | Low      | Security    | `lib/auth.ts:64`                           | Better-auth rate limiting commented out                                |
| 23 | High     | AI          | `chat/route.ts:210`                        | `providerOptions.deepseek.safetySettings` uses Gemini's shape          |
| 24 | High     | AI          | `services/ai/prompts.ts:30`                | Prompt injection via raw `${context}` / `${question}`                  |
| 25 | High     | AI          | `chat/route.ts:173`                        | DB role `"system"` (assistant replies) sent back as system on every turn |
| 26 | High     | RAG         | `uploadthing/core.ts:62`                   | PDF re-upload doesn't delete old namespace vectors                     |
| 27 | Low      | UI          | `newChatbtn.tsx:83`                        | `userid` form default captures stale session                           |
| 28 | Medium   | DB          | `chat/create.ts:18`                        | Form field `workSection` collected but never stored (no column)        |
| 29 | Low      | Config      | `next.config.ts:8`                         | Image `remotePatterns` too narrow for UploadThing hosts                |
| 30 | Medium   | Security    | `app/chat/[id]/page.tsx`                   | Chat URL has no server-side ownership gate                             |
| 31 | Low      | Feature gap | `chats.tsx`                                | `deleteChat` action wired nowhere                                      |
| 32 | Low      | SSR         | `dashboard/page.tsx` + `cacheComponents`   | `useSession` on client with `cacheComponents:true` → stale UI flash    |

---

## Recommended fix order

1. Rotate leaked GCP key and scrub from git history — **#4**.
2. Declare missing env vars — **#2**.
3. Unify embedding provider on both paths and re-ingest — **#3** + **#6**.
4. Switch to TCP Redis or REST-compatible queue — **#5**.
5. Rename `proxy.ts` → `middleware.ts` — **#7**.
6. Fix auth surface: `signUp.social`, password input, rate limit — **#1**, **#8**, **#22**.
7. Fix chat correctness: ordering, role mapping, prompt injection, re-upload — **#11**, **#25**, **#24**, **#26**.
8. UI polish: sync effect, navigation, delete UI — **#9**, **#19**, **#31**.
9. Cleanup — **#15**, **#16**, **#18**, **#20**, **#21**.

---

## Critical

### #1 — OAuth sign-up wrappers call `signIn.social`

- **Where:** `lib/auth-client.ts:26-34` · `understanding.md` §5.3
- **Cause:** `signUpWith{Github,Discord,Google}` delegate to `signIn.social(...)` instead of `signUp.social(...)`.
- **Impact:** First-time OAuth users cannot register through `/signup`; better-auth's sign-up flow (account-creation branch) is never reached.
- **Fix:** Replace `signIn.social` with `signUp.social` in all three wrappers.

### #2 — Missing env declarations for `GEMINI_AI_API_KEY` / `DEEPSEEK_API_KEY`

- **Where:** `lib/env.ts:3-42` (schema) vs `lib/integrations/pinecone.ts:20`, `app/api/chat/route.ts:24-26` · §4
- **Cause:** Keys are read off `env` but absent from `envSchema`; the lazy proxy returns `undefined` silently.
- **Impact:** DeepSeek + Gemini clients are built with `apiKey: undefined`; errors surface as remote 401 instead of clear boot-time failure.
- **Fix:** Add `GEMINI_AI_API_KEY` and `DEEPSEEK_API_KEY` as `z.string().min(1)` in `envSchema`. Delete the commented `PREM_AI_API_KEY` line 13.

### #3 — Embedding pipeline is asymmetric (write ≠ read)

- **Where:** `lib/worker.ts:61-64` (Prem, bge-small, 384-dim) vs `lib/integrations/pinecone.ts:18-22` (Google) · §7.3, §7.4
- **Cause:** Different embedding providers + different dimensionalities used at write and query time.
- **Impact:** Pinecone queries either error on dimension mismatch or return semantically random neighbours. RAG is non-functional.
- **Fix:** Pick one provider. Safest: use `PremEmbeddings(@cf/baai/bge-small-en-v1.5)` on both paths.

### #4 — GCP service-account private key committed

- **Where:** `credentials.json` (tracked by git despite `.gitignore`) · §11
- **Cause:** Added to `.gitignore` after the file was already committed.
- **Impact:** Anyone with repo read access has a valid GCP private key for `leafra@leafra.iam.gserviceaccount.com`.
- **Fix:** (1) Rotate the key in GCP IAM immediately. (2) `git rm --cached credentials.json`. (3) Purge from history with `git filter-repo --path credentials.json --invert-paths` and force-push.

### #5 — Worker accepts Upstash REST URL as if it were TCP Redis

- **Where:** `lib/worker.ts:29-42` · §7.3
- **Cause:** `getRedisConnection()` does not short-circuit when URL is HTTPS; UploadThing side does (`app/api/uploadthing/core.ts:20`).
- **Impact:** Producer returns `null` queue (no jobs enqueued), worker dials TCP forever → end-to-end ingestion is broken.
- **Fix:** Return `null` for `http(s)` URLs in the worker too, and move to a TCP-reachable Redis (or QStash) for both sides.

### #6 — `gemini-2.5-flash` is a chat model, not an embedder

- **Where:** `lib/integrations/pinecone.ts:19` · §7.4
- **Cause:** Chat model id passed to `GoogleGenerativeAIEmbeddings`.
- **Impact:** `embedContent` rejects the model; even if it accepted, dim wouldn't match Pinecone index.
- **Fix:** Use `text-embedding-004` (768-dim) — and re-create the Pinecone index at 768, or unify on Prem per #3.

### #7 — `proxy.ts` never runs as Next.js middleware

- **Where:** `proxy.ts` · §5.5
- **Cause:** Next only loads `middleware.ts` exporting `middleware`.
- **Impact:** Landing-page redirect and `/dashboard`, `/chat/*` gating are dead code.
- **Fix:** Rename file to `middleware.ts` and the function to `middleware`.

### #8 — Email sign-in sends empty password

- **Where:** `components/custom/sign-in.tsx:21-31` · §10
- **Cause:** No password `<Input>`; `signIn.email({email, password: ""})`.
- **Impact:** Email/password sign-in is a no-op in the UI.
- **Fix:** Add a `password` state + input, pass it to `signIn.email`, surface errors via `fetchOptions.onError`.

---

## High

### #9 — `useChat` sync effect depends on `messages`

- **Where:** `app/chat/[id]/page.tsx:89-104` · §6.4
- **Cause:** `messages` is in the dep array and inside the effect body, so streaming updates re-trigger the DB-snapshot sync.
- **Impact:** Mid-stream flicker; post-stream the DB refetch can overwrite in-flight messages.
- **Fix:** Drop `messages` from deps and gate with `messages.length === 0` — or remove the effect entirely and rely on `useChat({ messages: initialMessages })` once.

### #11 — `getMessages` missing `ORDER BY`

- **Where:** `app/actions/message/get.ts:10-13` · §6.6
- **Cause:** Plain `select().where(...)` without ordering.
- **Impact:** Message order is non-deterministic; UI can render user/assistant turns out of sequence.
- **Fix:** `.orderBy(asc(messages.createdAt), asc(messages.id))`.

### #23 — DeepSeek `providerOptions.safetySettings` uses Gemini shape

- **Where:** `app/api/chat/route.ts:210-219`
- **Cause:** `HARM_CATEGORY_SEXUALLY_EXPLICIT`, `BLOCK_LOW_AND_ABOVE` are Google Gemini's API, not DeepSeek's.
- **Impact:** Setting is silently dropped by the DeepSeek provider; dev assumes safety filter is active.
- **Fix:** Remove the `providerOptions` block (or move to a real Gemini provider if intended).

### #24 — Prompt injection through raw PDF content

- **Where:** `lib/services/ai/prompts.ts:30-43`
- **Cause:** `${context}` and `${question}` interpolated verbatim into the system prompt; `<pdf_context>` is just a string literal.
- **Impact:** A PDF containing `</pdf_context>` + adversarial instructions can hijack the model.
- **Fix:** Pass the PDF context as a separate user-role message, or escape the closing tag and require the model to ignore content that contains instructions.

### #25 — DB `"system"` rows re-sent as system on every turn

- **Where:** `app/api/chat/route.ts:173-197`, `createMessage(..., "system")` at line 230
- **Cause:** Schema enum lacks `"assistant"`, so assistant replies are stored as `"system"`; history is then sent back to the model with that role.
- **Impact:** Multi-turn chats accumulate "systems" → DeepSeek treats every past reply as system instruction → drift and context pollution.
- **Fix:** Map DB role `"system"` → SDK role `"assistant"` when transforming, or add `"assistant"` to `userSystemEnum` and migrate.

### #26 — Re-uploading a PDF leaves stale vectors in the namespace

- **Where:** `app/api/uploadthing/core.ts:62-130`, `lib/worker.ts:125-127`
- **Cause:** `updateFile` overwrites `pdfUrl` in DB but nothing deletes old vectors from `leafravectordb/<chatId>`.
- **Impact:** Answers mix old and new PDF content.
- **Fix:** In `onUploadComplete` (or worker entry), call `pineconeIndex.namespace(chatId).deleteAll()` before enqueuing the new job.

---

## Medium

### #10 — Empty chats list returned as 404

- **Where:** `app/actions/chat/get.ts:53-60` · §6.2
- **Fix:** Return `{data: [], error: null, status: 200}`.

### #12 — `pdfSize` never persisted

- **Where:** `app/actions/file/update.ts:8-21`, `app/api/uploadthing/core.ts:130` · §7.1/§7.2
- **Fix:** Extend `updateFile` to accept `pdfSize` and pass `file.size`.

### #13 — `NEXT_PUBLIC_APP_URL` vs `NEXT_PUBLIC_BASE_URL`

- **Where:** `lib/auth-client.ts:8` vs `lib/env.ts:30-38` · §4/§5.3
- **Impact:** Preview deployments and self-hosting misroute OAuth callbacks.
- **Fix:** Pick one name; update schema, README, and both `auth*.ts` files.

### #14 — `response.buffer()` is removed in node-fetch v3

- **Where:** `lib/worker.ts:92` · §7.3
- **Fix:** Drop `node-fetch`, use global `fetch`, replace with `Buffer.from(await response.arrayBuffer())`.

### #17 — Worker assumes `doc.metadata.loc.pageNumber` exists

- **Where:** `lib/worker.ts:113, 118` · §7.3
- **Fix:** `const pageNumber = doc.metadata?.loc?.pageNumber ?? 0;` and use it in both `id` and `metadata`.

### #28 — `workSection` collected but not stored

- **Where:** `components/custom/newChatbtn.tsx:59-72`, `app/actions/chat/create.ts:18-24`, `lib/db/schema.ts:28`
- **Impact:** Users pick a "work section" that is silently discarded.
- **Fix:** Add `workSection text` column to `chat`, write it in `createChat`, surface in UI.

### #30 — No server-side ownership gate on `/chat/[id]`

- **Where:** `app/chat/[id]/page.tsx` (client-only) · §5.4
- **Cause:** Ownership is checked only at the API boundary; the page shell renders for anyone.
- **Impact:** Chat-id existence leaks via timing; UX shows a blank workspace for strangers.
- **Fix:** Add `app/chat/[id]/layout.tsx` as a server component that calls `ensureChatOwnership`, redirects to `/dashboard` on failure.

---

## Low

### #15 — `useSonner` import is bogus

- **Where:** `app/api/uploadthing/core.ts:5`
- **Fix:** Delete the import.

### #16 — Discord image typo

- **Where:** `components/custom/sign-up.tsx:129` — `discordd.png`
- **Fix:** Use `/discord.svg` like sign-in.

### #18 — `actions/session.ts` mixes client/server APIs

- **Where:** `actions/session.ts` · §8
- **Fix:** Delete it, or rewrite with `auth.api.getSession({headers: await headers()})` and redirect to `/signin` (note the spelling).

### #19 — New-chat form doesn't navigate

- **Where:** `components/custom/newChatbtn.tsx:91-103`
- **Fix:** `const res = await createChat(data); if (res?.data?.id) router.push(`/chat/${res.data.id}`);`.

### #20 — `app/index.ts` orphan

- **Where:** `app/index.ts`
- **Fix:** Delete.

### #21 — `dev:worker` script is a trap

- **Where:** `package.json:7`
- **Fix:** Use `concurrently`, or document two-terminal setup, or split into `dev:worker:build` + `dev:worker:run`. Also remove the stray `--watch` file in repo root.

### #22 — Auth rate limiting disabled

- **Where:** `lib/auth.ts:64-68`
- **Fix:** Re-enable `rateLimit` with Upstash-backed storage.

### #27 — `userid` form default captures stale session

- **Where:** `components/custom/newChatbtn.tsx:75-85`
- **Fix:** Remove `userid` from the form entirely — the server already knows `session.user.id`.

### #29 — Image `remotePatterns` is too narrow

- **Where:** `next.config.ts:7-15`
- **Fix:** Also allow `**.ufs.sh` and `utfs.io/a/*`. Only relevant if `<Image>` is ever used for the PDF; current `<iframe>` doesn't care.

### #31 — `deleteChat` has no UI

- **Where:** `app/actions/chat/delete.ts` wired nowhere
- **Fix:** Add a dropdown-menu item on `<Chatcard />` that calls `deleteChat` + `queryClient.invalidateQueries(["chats"])`.

### #32 — `useSession` on client + `cacheComponents:true`

- **Where:** `app/dashboard/page.tsx`, `next.config.ts:5`
- **Impact:** Initial render can show stale/unauthenticated state until hydration.
- **Fix:** Resolve session in a server component and pass down as a prop; keep `useSession` only where reactivity is actually needed.

---

## Cross-reference

| Bug | File                                                      | `understanding.md` |
|----:|-----------------------------------------------------------|--------------------|
|   1 | `lib/auth-client.ts`                                      | §5.3               |
|   2 | `lib/env.ts`, `lib/integrations/pinecone.ts`, `app/api/chat/route.ts` | §4 · §7.4 · §6.5 |
|   3 | `lib/worker.ts`, `lib/integrations/pinecone.ts`           | §7.3 · §7.4 · §12  |
|   4 | `credentials.json`                                        | §11                |
|   5 | `lib/worker.ts`                                           | §7.3               |
|   6 | `lib/integrations/pinecone.ts`                            | §7.4               |
|   7 | `proxy.ts`                                                | §5.5               |
|   8 | `components/custom/sign-in.tsx`                           | §10                |
|   9 | `app/chat/[id]/page.tsx`                                  | §6.4               |
|  10 | `app/actions/chat/get.ts`                                 | §6.2               |
|  11 | `app/actions/message/get.ts`                              | §6.6               |
|  12 | `app/actions/file/update.ts`, `app/api/uploadthing/core.ts` | §7.1 · §7.2      |
|  13 | `lib/auth-client.ts`, `lib/env.ts`                        | §4 · §5.3          |
|  14 | `lib/worker.ts`                                           | §7.3               |
|  15 | `app/api/uploadthing/core.ts`                             | §8                 |
|  16 | `components/custom/sign-up.tsx`                           | §10                |
|  17 | `lib/worker.ts`                                           | §7.3               |
|  18 | `actions/session.ts`                                      | §8                 |
|  19 | `components/custom/newChatbtn.tsx`                        | §6.1               |
|  20 | `app/index.ts`                                            | §8                 |
|  21 | `package.json`                                            | §11                |
|  22 | `lib/auth.ts`                                             | §5.1               |
|  23 | `app/api/chat/route.ts`                                   | §6.5               |
|  24 | `lib/services/ai/prompts.ts`                              | §6.5               |
|  25 | `app/api/chat/route.ts`, `lib/db/schema.ts`               | §3 · §6.5          |
|  26 | `app/api/uploadthing/core.ts`, `lib/worker.ts`            | §7.1 · §7.3        |
|  27 | `components/custom/newChatbtn.tsx`                        | §6.1               |
|  28 | `components/custom/newChatbtn.tsx`, `app/actions/chat/create.ts`, `lib/db/schema.ts` | §3 · §6.1 |
|  29 | `next.config.ts`                                          | §11                |
|  30 | `app/chat/[id]/page.tsx`                                  | §5.4 · §6.4        |
|  31 | `app/actions/chat/delete.ts`, `components/chats.tsx`      | §6.2               |
|  32 | `app/dashboard/page.tsx`, `next.config.ts`                | §11                |
