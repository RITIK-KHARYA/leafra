import { Worker } from "bullmq";
import fetch from "node-fetch";
import * as dotenv from "dotenv";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { TogetherAIEmbeddings } from "@langchain/community/embeddings/togetherai";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";

dotenv.config({
  path: ".env",
});

console.log("heehe");
console.log("server started hogaya diddy");

// console.log("🌲 PINECONE_API_KEY =", process.env.PINECONE_API_KEY);
// console.log("📦 PINECONE_INDEX =", process.env.PINECONE_INDEX);

// 🌲 Pinecone setup
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});
const pineconeIndex = pinecone.index(process.env.PINECONE_INDEX!);

// 🧠 Embeddings setup
const embeddings = new TogetherAIEmbeddings({
  model: "togethercomputer/m2-bert-80M-8k-retrieval",
  apiKey: process.env.TOGETHER_AI_API_KEY!,
});

// 🧾 PDF Upload Worker
const worker = new Worker(
  "upload-pdf",
  async (job) => {
    try {
      if (job.name !== "upload-pdf") return;

      const fileUrl = job.data.fileUrl;
      const response = await fetch(fileUrl);
      const buffer = await response.buffer();
      const blob = new Blob([buffer], { type: "application/pdf" });

      const loader = new WebPDFLoader(blob, { splitPages: true });
      const rawDocs = await loader.load();

      const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
      });
      const docs = await splitter.splitDocuments(rawDocs);

      const vectors = await PineconeStore.fromDocuments(docs, embeddings, {
        pineconeIndex,
      });

      console.log(vectors);
      console.log("✅ PDF embedded and stored in Pinecone.");
    } catch (err) {
      console.error("❌ Error processing job:", err);
    }
  },
  {
    connection: {
      url: process.env.REDIS_URL!,
    },
  }
);
