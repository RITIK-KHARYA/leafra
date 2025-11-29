import { TogetherAIEmbeddings } from "@langchain/community/embeddings/togetherai";
import { Pinecone } from "@pinecone-database/pinecone";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";

let pinecone: Pinecone | null = null;

export function getPineconeClient() {
  if (!pinecone) {
    pinecone = new Pinecone({
      apiKey: env.PINECONE_API_KEY,
    });
  }
  return pinecone;
}

const embeddingAI = new TogetherAIEmbeddings({
  model: env.TOGETHER_AI_MODEL,
  apiKey: env.TOGETHER_AI_API_KEY,
});

function createEmbedding(text: string) {
  return embeddingAI.embedQuery(text);
}

export async function getResultFromQuery(query: string, chatId: string) {
  const pinecone = getPineconeClient();
  const index = pinecone.index("leafravectordb");
  const namespace = index.namespace(chatId);
  const embeddedQuery = await createEmbedding(query);
  const results = await namespace.query({
    vector: embeddedQuery,
    topK: 3,
    includeMetadata: true,
    includeValues: true,
  });
  const thresholdvalue = 0.5;
  const data = results.matches
    .filter(
      (match) => match.score !== undefined && match.score > thresholdvalue
    )
    .map((match) => {
      const content = match.metadata?.content;
      return typeof content === "string" ? content : "";
    })
    .filter((content) => content.length > 0)
    .join("\n\n");

  if (!data) {
    return "No results found";
  } else {
    logger.debug("Pinecone query results", { results, data });
    return data;
  }
}
