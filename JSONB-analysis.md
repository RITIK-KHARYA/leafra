# JSONB Optimization Analysis

Derived from `readme[api].md`. Each row is a concrete column (or ad-hoc
encoding) that would benefit from being stored as a PostgreSQL `JSONB` field
with a matching `GIN` index.

Rule of thumb used: recommend JSONB only when **(a)** the column is
semi-structured / nested, **(b)** we already query it by key or membership,
and **(c)** a GIN index speeds the query up by at least 10×. Plain-text
columns that are only read in full are NOT candidates.

---

## Summary

| # | Column / data                           | Today                                  | Proposed                             | Win                                                                 |
| - | --------------------------------------- | -------------------------------------- | ------------------------------------ | ------------------------------------------------------------------- |
| 1 | `account.scope`                         | `text` — comma-separated string        | `jsonb` array + `GIN`                | `WHERE scope ? 'email'` instead of `LIKE '%email%'`                 |
| 2 | `chat` PDF metadata (`pdfUrl/Name/Size`) | three nullable columns                 | `jsonb` `file` column                | multi-PDF support + atomic update; `GIN` index on `file->>'status'`  |
| 3 | `chat` form metadata (`workSection`, future fields) | silently dropped          | `jsonb` `metadata` column            | loss-less form persistence without per-field migrations              |
| 4 | Pinecone per-chunk metadata (mirror)    | only in Pinecone                       | `jsonb` `citations` on `messages`    | surface citations (page # / score) without a Pinecone round-trip    |
| 5 | BullMQ job payload mirror / ingestion status | fire-and-forget                    | `jsonb` `ingestion` on `chat`        | UI can poll ingestion progress & failures                            |
| 6 | `messages.usage` (DeepSeek `usage` object) | not stored                           | `jsonb` `usage` on `messages`        | token accounting / cost per chat (feature #10 from the backlog)     |

Each candidate has a **shape**, **migration**, **query pattern**, **GIN
index**, and **expected speedup / unblocked feature** below.

---

## 1. `account.scope` — comma-separated scope → `jsonb[]`

**Today** (`lib/db/schema.ts`): `scope text` — better-auth writes values like
`"openid,profile,email"`. The only way to check "does this account have the
`email` scope" today is `WHERE scope LIKE '%email%'`, which is ambiguous
(`"email_verified"` would match) and cannot use an index.

**Proposed**
```sql
ALTER TABLE "account" ADD COLUMN scopes jsonb;
-- backfill:
UPDATE "account"
SET scopes = to_jsonb(string_to_array(scope, ','))
WHERE scope IS NOT NULL;
CREATE INDEX account_scopes_gin ON "account" USING GIN (scopes);
```

**Query pattern**
```sql
-- Before
SELECT * FROM "account" WHERE user_id = $1 AND scope LIKE '%email%';

-- After
SELECT * FROM "account" WHERE user_id = $1 AND scopes ? 'email';
```

**Caveat**: better-auth owns the `scope` column on its side. Keep `scope` for
compatibility, add `scopes` as a computed mirror populated by a trigger:
```sql
CREATE OR REPLACE FUNCTION account_sync_scopes() RETURNS TRIGGER AS $$
BEGIN
  NEW.scopes := CASE
    WHEN NEW.scope IS NULL THEN NULL
    ELSE to_jsonb(string_to_array(NEW.scope, ','))
  END;
  RETURN NEW;
END $$ LANGUAGE plpgsql;

CREATE TRIGGER account_sync_scopes_trg
BEFORE INSERT OR UPDATE OF scope ON "account"
FOR EACH ROW EXECUTE PROCEDURE account_sync_scopes();
```

**Speedup**: O(n) full scan → O(log n) index lookup on a user's account list.
Scales with `account` row count (one per provider per user).

---

## 2. `chat.pdfUrl / pdfName / pdfSize` → `chat.files: jsonb`

**Today** (`lib/db/schema.ts`): three sibling nullable columns. Single file per
chat — re-uploading overwrites everything; history is lost. Unlocks feature #4
("multi-PDF per chat") from the backlog.

**Proposed shape**
```ts
type FileRef = {
  id: string;           // uuid
  url: string;          // UploadThing URL
  name: string;
  size: number;
  uploadedAt: string;   // ISO
  status: "pending" | "indexed" | "failed";
  pinecone?: { namespace: string; vectorCount: number };
};
chat.files: jsonb // FileRef[]
```

**Migration**
```sql
ALTER TABLE "chat" ADD COLUMN files jsonb NOT NULL DEFAULT '[]'::jsonb;
-- backfill single-file rows:
UPDATE "chat"
SET files = jsonb_build_array(jsonb_build_object(
  'id', gen_random_uuid(),
  'url', pdf_url,
  'name', pdf_name,
  'size', pdf_size,
  'uploadedAt', created_at,
  'status', 'indexed'
))
WHERE pdf_url IS NOT NULL;

CREATE INDEX chat_files_gin ON "chat" USING GIN (files jsonb_path_ops);
-- Optional targeted expression index (for the common "any failed upload" query)
CREATE INDEX chat_files_failed_idx
  ON "chat" ((files @> '[{"status":"failed"}]'::jsonb));
```

**Query patterns**
```sql
-- "does this chat have any failed uploads?" (GIN-backed)
SELECT 1 FROM "chat" WHERE id = $1 AND files @> '[{"status":"failed"}]';

-- "all of my chats with ≥ one indexed PDF"
SELECT id, title FROM "chat"
WHERE user_id = $1 AND files @> '[{"status":"indexed"}]';
```

**API impact**: `GET /api/messages` and the chat page already surface a single
`pdfUrl` — would become `chat.files[0]?.url` for backward compatibility, with
a follow-up that renders a file picker. `updateFile(...)` becomes a
`pushFile(...)` using `jsonb_set` + `||` to append.

---

## 3. `chat.metadata: jsonb` (absorb `workSection` + future form fields)

**Today**: `components/custom/newChatbtn.tsx` collects `workSection` (student /
office / developer / …) but <ref_snippet file="/home/ubuntu/leafra/app/actions/chat/create.ts" lines="17-23" />
drops it — there is no column. Same problem will recur every time the form
adds a field (tags, color, …).

**Proposed**
```sql
ALTER TABLE "chat" ADD COLUMN metadata jsonb NOT NULL DEFAULT '{}'::jsonb;
CREATE INDEX chat_metadata_gin ON "chat" USING GIN (metadata jsonb_path_ops);
```
```ts
// app/actions/chat/create.ts (minimal diff)
await db.insert(chat).values({
  ...,
  metadata: {
    workSection: input.workSection,
    priority: input.priority, // also mirror here; makes `value` legacy-only
  },
});
```

**Query pattern** — dashboard filter (not implemented yet, but cheap to add):
```sql
SELECT id, title FROM "chat"
WHERE user_id = $1 AND metadata @> '{"workSection":"student"}'::jsonb;
```

**Speedup**: with ~10 chats per user this is negligible in wall-clock, but the
**real** win is that adding a new form field no longer needs a migration.

---

## 4. `messages.citations: jsonb` — per-message citations

**Today**: `lib/worker.ts` stores `{ pageNumber, content }` on each Pinecone
vector's metadata. At query time `getResultFromQuery` concatenates `.content`
into one string; `pageNumber` is **discarded**, so the UI can't show citations.
Feature #3 from the backlog ("streaming citations") needs this.

**Proposed**
```sql
ALTER TABLE messages ADD COLUMN citations jsonb;
CREATE INDEX messages_citations_gin ON messages USING GIN (citations jsonb_path_ops);
```
```ts
// shape
citations: Array<{ pageNumber: number; score: number; excerpt: string }>
```

**Producer**: when `/api/chat` receives Pinecone matches, store them on the
user+assistant pair written by `createMessage`. Current call site:
<ref_snippet file="/home/ubuntu/leafra/app/api/chat/route.ts" lines="161-168" />

**Query patterns**
```sql
-- "show me all messages that cited page 3 of any PDF"
SELECT id, content FROM messages
WHERE chat_id = $1 AND citations @> '[{"pageNumber":3}]';

-- "top-cited pages across a chat" — jsonb_path_query_array
SELECT jsonb_path_query_array(
  jsonb_agg(citations),
  '$[*].pageNumber'
) FROM messages WHERE chat_id = $1;
```

**Speedup**: avoids re-hitting Pinecone for UI rendering of citations
(Pinecone roundtrip is ~150ms; PG local ~1ms).

---

## 5. `chat.ingestion: jsonb` — PDF ingestion status

**Today**: upload is fire-and-forget. The UI has no signal for "indexed yet?",
so users can ask questions before vectors are ready and the bot answers "No
context available" (see `getResultFromQuery` fallback).

**Proposed**
```ts
chat.ingestion: jsonb // { status: "pending"|"running"|"done"|"failed", chunks?: number, error?: string, updatedAt: string }
```
```sql
ALTER TABLE "chat" ADD COLUMN ingestion jsonb;
CREATE INDEX chat_ingestion_status_idx
  ON "chat" ((ingestion->>'status'));
```

**Query pattern** — the chat page can poll:
```sql
SELECT ingestion FROM "chat" WHERE id = $1;
-- or: WHERE ingestion->>'status' = 'failed' AND updated_at > now() - interval '1 hour'
```

**Producer**: `lib/worker.ts` writes `{status:'running'}` at start and
`{status:'done', chunks: N}` on completion (or `{status:'failed', error}` on
catch). This is a **one-column** change, no migration of existing rows.

---

## 6. `messages.usage: jsonb` — token accounting

**Today**: `streamText.onFinish` receives `responseText` but the DeepSeek
`usage` object (prompt / completion / total tokens) is ignored. Feature #10
("usage dashboard") needs it.

**Proposed**
```sql
ALTER TABLE messages ADD COLUMN usage jsonb;
-- no GIN needed - we aggregate, not search
-- but a narrow expression index helps dashboards:
CREATE INDEX messages_total_tokens_idx
  ON messages (((usage->>'totalTokens')::int));
```
```ts
// app/api/chat/route.ts - onFinish
onFinish: async ({ text, usage }) => {
  await withRetry(
    () => createMessage(chatId, text, "system", { usage }),
    3, 100,
  );
}
```

**Query pattern** — dashboard aggregate:
```sql
SELECT chat_id, SUM((usage->>'totalTokens')::int) AS tokens
FROM messages
WHERE chat_id = ANY($1) AND usage IS NOT NULL
GROUP BY chat_id;
```

---

## What is NOT a JSONB candidate

- **`messages.content`** — plain natural language, never searched structurally.
  Would lose full-text search capability (`tsvector`-backed). Keep as `text`.
- **`chat.title`, `chat.description`** — same reasoning. A future full-text
  search (feature #8) wants a `tsvector` column, not `jsonb`.
- **`chat.value`** (priority enum) — five-valued, high-cardinality flag. A
  `pgEnum` is the right tool, not JSONB.
- **`user.email`, `session.token`, `account.access_token`** — indexed
  scalars / secrets. No nesting, no benefit.

---

## Rollout order (smallest surface → largest)

1. **(#3 metadata)** — non-breaking, one additive column, fixes
   dropped-`workSection` bug with zero migration risk.
2. **(#5 ingestion)** — additive column, enables a meaningful UI signal,
   worker is the only writer.
3. **(#6 messages.usage)** — additive column, no caller churn until the
   dashboard feature lands.
4. **(#4 messages.citations)** — additive column + `/api/chat` change to
   populate. Requires parallel changes in the chat page UI.
5. **(#1 account.scopes)** — additive + trigger. Low impact unless better-auth
   scope checks become frequent.
6. **(#2 chat.files)** — biggest change; requires migrating the UploadThing
   flow and the chat page. Do this last, together with the multi-PDF feature.

## Indexing summary

| Table      | Column       | Index kind                                     |
| ---------- | ------------ | ---------------------------------------------- |
| `account`  | `scopes`     | `GIN` (default ops; `?` and `@>`)              |
| `chat`     | `files`      | `GIN (jsonb_path_ops)` + expression idx        |
| `chat`     | `metadata`   | `GIN (jsonb_path_ops)`                         |
| `chat`     | `ingestion`  | expression `((ingestion->>'status'))`          |
| `messages` | `citations`  | `GIN (jsonb_path_ops)`                         |
| `messages` | `usage`      | expression `(((usage->>'totalTokens')::int))`  |

`jsonb_path_ops` is chosen over default ops because all planned queries use
`@>` containment; `jsonb_path_ops` builds a smaller index and is strictly
faster for `@>` at the cost of dropping `?` and `?|` support. Where `?` is
needed (candidate #1, `account.scopes`) we use the default ops class.
