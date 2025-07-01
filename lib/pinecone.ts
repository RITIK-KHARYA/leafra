import { TogetherAIEmbeddings } from "@langchain/community/embeddings/togetherai";
import { Pinecone } from "@pinecone-database/pinecone";

let pinecone;
export function getPineconeClient() {
  pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
  });
  return pinecone;
}

const embeddingAI = new TogetherAIEmbeddings({
  model: process.env.TOGETHER_AI_MODEL!,
  apiKey: process.env.TOGETHER_AI_API_KEY!,
});

function createEmbedding(text: string) {
  return embeddingAI.embedQuery(text);
}

export async function getResultFromQuery(query: string) {
  const pinecone = getPineconeClient();
  const index = pinecone.index("leafravectordb");
  const embeddedQuery = await createEmbedding(query);
  const results = await index.query({
    vector: embeddedQuery,
    topK: 3,
    includeMetadata: true,
    includeValues: true,
  });
  console.log(results);
  return results;
}


