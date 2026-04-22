import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { Pinecone } from "@pinecone-database/pinecone";
import { logger } from "../logger";
import { env, requireEnv } from "../env";

let pinecone: Pinecone | null = null;

export function getPineconeClient() {
  if (!pinecone) {
    pinecone = new Pinecone({
      apiKey: env.PINECONE_API_KEY,
    });
  }
  return pinecone;
}

// Lazily create the embedding client so simply importing this module (e.g.
// from a server component that never calls getResultFromQuery) does not
// require GEMINI_AI_API_KEY to be set.
let embeddingAI: GoogleGenerativeAIEmbeddings | null = null;
function getEmbeddingClient(): GoogleGenerativeAIEmbeddings {
  if (!embeddingAI) {
    embeddingAI = new GoogleGenerativeAIEmbeddings({
      model: "gemini-2.5-flash",
      apiKey: requireEnv("GEMINI_AI_API_KEY", "Pinecone retrieval"),
      taskType: TaskType.RETRIEVAL_DOCUMENT,
    });
  }
  return embeddingAI;
}

function createEmbedding(text: string) {
  return getEmbeddingClient().embedQuery(text);
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
      (match) => match.score !== undefined && match.score > thresholdvalue,
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
