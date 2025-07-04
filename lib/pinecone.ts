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

async function getAnswers(query: string) {
  const results = await fetch("http://localhost:3000/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages: [
        {
          content: query,
          role: "user",
        },
      ],
    }),
  });
  const data = await results.json();
  console.log(data);
}

getAnswers("what is future ritik holds");
