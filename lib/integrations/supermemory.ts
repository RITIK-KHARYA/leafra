import Supermemory from "supermemory";
import { requireEnv } from "../env";
import { logger } from "../logger";

let client: Supermemory | null = null;

function getClient(): Supermemory {
  if (!client) {
    client = new Supermemory({
      apiKey: requireEnv("SUPERMEMORY_API_KEY", "supermemory"),
    });
  }
  return client;
}

/**
 * Add a document (text or URL) to SuperMemory, scoped to a chat namespace.
 * SuperMemory handles chunking, embedding, and indexing automatically.
 */
export async function addDocument(
  content: string,
  chatId: string,
  customId?: string,
  metadata?: Record<string, string | number | boolean>,
) {
  const sm = getClient();
  const response = await sm.documents.add({
    content,
    containerTag: chatId,
    ...(customId && { customId }),
    ...(metadata && { metadata }),
  });
  logger.info("SuperMemory document added", {
    id: response.id,
    status: response.status,
    chatId,
  });
  return response;
}

/**
 * Search documents scoped to a specific chat namespace.
 * Returns concatenated relevant chunks or a fallback message.
 */
export async function searchDocuments(
  query: string,
  chatId: string,
): Promise<string> {
  const sm = getClient();
  const response = await sm.search.documents({
    q: query,
    containerTags: [chatId],
    limit: 5,
    chunkThreshold: 0.3,
    onlyMatchingChunks: false,
  });

  const chunks = response.results
    .flatMap((result) =>
      result.chunks
        .filter((chunk) => chunk.isRelevant)
        .map((chunk) => chunk.content),
    )
    .filter((content) => content.length > 0);

  if (chunks.length === 0) {
    logger.debug("SuperMemory search returned no relevant results", {
      chatId,
      query,
    });
    return "No results found";
  }

  const data = chunks.join("\n\n");
  logger.debug("SuperMemory search results", {
    chatId,
    resultCount: chunks.length,
  });
  return data;
}

/**
 * Remove all documents scoped to a chat namespace.
 */
export async function purgeDocuments(chatId: string): Promise<void> {
  const sm = getClient();
  try {
    await sm.documents.deleteBulk({ containerTags: [chatId] });
    logger.info("SuperMemory documents purged", { chatId });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (/not\s*found|404/i.test(message)) {
      logger.debug("No existing documents to purge", { chatId });
      return;
    }
    logger.warn("Failed to purge documents (continuing)", {
      chatId,
      error: message,
    });
  }
}
