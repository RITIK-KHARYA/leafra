# Testing Leafra

Leafra is a Next.js 15 (App Router) PDF RAG system using Google Gemini for chat and embeddings, Pinecone for vector storage, and BullMQ/Redis for background PDF processing.

## Devin Secrets Needed

| Secret | Purpose | Required For |
|---|---|---|
| `GOOGLE_GENERATIVE_AI_API_KEY` | Gemini API key for chat + embeddings | Integration tests, local dev |
| `DATABASE_URL` | PostgreSQL connection string | Full app boot, E2E testing |
| `PINECONE_API_KEY` | Vector database access | Full app boot, RAG testing |
| `UPSTASH_REDIS_REST_URL` | Redis for BullMQ worker + rate limiting | Worker testing, rate limit testing |
| `UPSTASH_REDIS_REST_TOKEN` | Redis auth token | Worker testing, rate limit testing |

## Quick Commands

```bash
# Install dependencies (project uses bun.lock)
bun install

# Build
DATABASE_URL="postgres://dummy:dummy@localhost:5432/leafra" PINECONE_API_KEY="dummy" bun run build

# TypeScript check
npx tsc --noEmit

# Unit tests (91 tests across 7 suites)
bun run test
# Note: tests/retry.test.ts may fail if DATABASE_URL is not set — this is a known issue

# Lint (may fail due to pre-existing ESLint circular reference issue)
bun run lint
```

## Architecture (AI Pipeline)

| Component | File | Provider | Model |
|---|---|---|---|
| Chat streaming | `app/api/chat/route.ts` | `@ai-sdk/google` (Vercel AI SDK) | `gemini-2.5-flash` |
| Retrieval embeddings | `lib/integrations/pinecone.ts` | `@langchain/google-genai` | `gemini-embedding-001` |
| Ingestion embeddings | `lib/worker.ts` | `@langchain/google-genai` | `gemini-embedding-001` |

All three use the single `GEMINI_AI_API_KEY` env var.

## Integration Testing (without full infrastructure)

When `DATABASE_URL` and `PINECONE_API_KEY` are not available, you can still verify the AI providers work by writing a standalone script:

```typescript
// Test chat: createGoogleGenerativeAI + generateText with gemini-2.5-flash
// Test embeddings: GoogleGenerativeAIEmbeddings with gemini-embedding-001
//   - Both RETRIEVAL_DOCUMENT and RETRIEVAL_QUERY task types
//   - Verify dimensions match (should be 3072)
```

Run with: `node --import tsx <script.ts>`

Note: `bun run` may fail with newer `@ai-sdk/google` versions that require `zod/v4` — use Node + tsx instead.

## E2E Testing (requires full infrastructure)

UI flow: `/dashboard` → create chat → `/chat/[id]` → type message → stream response

1. Set all required env vars in `.env.local`
2. `bun run dev` (starts Next.js dev server on port 3000)
3. Sign up/in via `/signin` or `/signup`
4. Create a chat from `/dashboard`
5. Upload a PDF → worker processes it into Pinecone embeddings
6. Ask a question about the PDF → verify streamed response references PDF content

Worker needs separate terminal: `tsc --watch ./lib/worker.ts && bunx nodemon ./lib/worker.js`

## Known Issues

- Vercel CI deployments may fail with pre-existing config issues (not related to code changes)
- `tests/retry.test.ts` fails without `DATABASE_URL` set (pre-existing)
- ESLint has a circular reference issue in config that prevents `next lint` from running
- The project has a `bun.lock` — use `bun` for package management, not `npm`
