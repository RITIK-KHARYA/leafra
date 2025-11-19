import { TogetherAIEmbeddings } from "@langchain/community/embeddings/togetherai";
import { Pinecone } from "@pinecone-database/pinecone";

let pinecone: Pinecone | null = null;

export function getPineconeClient() {
  if (!pinecone) {
    pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });
  }
  return pinecone;
}

const embeddingAI = new TogetherAIEmbeddings({
  model: process.env.TOGETHER_AI_MODEL!,
  apiKey: process.env.TOGETHER_AI_API_KEY!,
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
    .filter((match) => match.score > thresholdvalue)
    .map((match) => match.metadata.content)
    .join("\n\n");

  if (!data) {
    return "No results found";
  } else {
    console.log(results);
    console.log("data", data);
    return data;
  }
}

