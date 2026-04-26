import { GoogleGenerativeAI, TaskType } from "@google/generative-ai";
import { requireEnv } from "./env";

/**
 * Embedding dimension configured to match the Pinecone index.
 * gemini-embedding-001 supports 768, 1024, and 3072 (default).
 */
const EMBEDDING_DIMENSIONS = 1024;

let genAI: GoogleGenerativeAI | null = null;
function getGenAI(): GoogleGenerativeAI {
  if (!genAI) {
    genAI = new GoogleGenerativeAI(
      requireEnv("GEMINI_AI_API_KEY", "embeddings"),
    );
  }
  return genAI;
}

/**
 * Create an embedding vector for the given text using gemini-embedding-001.
 * The output is truncated to EMBEDDING_DIMENSIONS to match the Pinecone index.
 */
export async function embedText(
  text: string,
  taskType: TaskType,
): Promise<number[]> {
  const model = getGenAI().getGenerativeModel({ model: "gemini-embedding-001" });
  // The Google REST API accepts outputDimensionality but the SDK types
  // don't include it yet, so we use a type assertion.
  const request = {
    content: { parts: [{ text }] },
    taskType,
    outputDimensionality: EMBEDDING_DIMENSIONS,
  };
  const result = await model.embedContent(
    request as unknown as Parameters<typeof model.embedContent>[0],
  );
  return result.embedding.values;
}
