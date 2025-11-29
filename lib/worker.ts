import { Worker } from "bullmq";
import fetch from "node-fetch";
import * as dotenv from "dotenv";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { TogetherAIEmbeddings } from "@langchain/community/embeddings/togetherai";
import { Pinecone } from "@pinecone-database/pinecone";
import { getPineconeClient } from "./integrations/pinecone";
import { getRedisClient } from "./integrations/redis";

dotenv.config({
  path: ".env",
});

interface Vector {
  id: string;
  values: number[];
  metadata: {
    pageNumber: number;
    content: string;
  };
}

console.log("hehe");
console.log("server started hogaya diddy");

// 🌲 Pinecone setup
const pinecone = getPineconeClient();
const pineconeIndex = pinecone.index("leafravectordb");

// 🧠 Embeddings setup
const embeddingAI = new TogetherAIEmbeddings({
  model: process.env.TOGETHER_AI_MODEL!,
  apiKey: process.env.TOGETHER_AI_API_KEY!,
});

console.log("embeddings", embeddingAI);
console.log(process.env.TOGETHER_AI_API_KEY);

// 🧾 PDF Upload Worker
const worker = new Worker(
  "upload-pdf",
  async (job) => {
    try {
      if (job.name !== "upload-pdf") return;
      console.log("started");

      const fileUrl = job.data.fileUrl;
      const response = await fetch(fileUrl);
      const buffer = await response.buffer();
      const blob = new Blob([new Uint8Array(buffer)], {
        type: "application/pdf",
      });

      const loader = new WebPDFLoader(blob, { splitPages: true });
      const rawDocs = await loader.load();

      const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
      });

      const docs = await splitter.splitDocuments(rawDocs);

      console.log(
        docs.map((page) => ({
          pageContent: page.pageContent.replace(/\n/g, ""),
          page: page.metadata.loc.pageNumber,
        }))
      );

      const docsPromise = docs.map(async (doc, idx) => ({
        id: `${fileUrl}-${doc.metadata.loc.pageNumber}-${idx}`,
        values: await embeddingAI.embedQuery(
          doc.pageContent.replace(/\n/g, "")
        ),
        metadata: {
          pageNumber: doc.metadata.loc.pageNumber.toString(),
          content: doc.pageContent.replace(/\n/g, ""),
        },
      }));

      const docsWithVectors = (await Promise.all(docsPromise)) as Vector[];

      const namespace = pineconeIndex.namespace(job.data.chatId);

      console.log(docsWithVectors);
      console.log("inserting in database");
      await namespace.upsert(docsWithVectors);
      console.log("✅ PDF embedded and stored in Pinecone.");
    } catch (err) {
      console.error("❌ Error processing job:", err);
    }
  },
  {
    connection: {
      host: process.env.UPSTASH_REDIS_REST_URL
        ? new URL(process.env.UPSTASH_REDIS_REST_URL).hostname
        : "localhost",
      port: 6379,
      password: process.env.UPSTASH_REDIS_REST_TOKEN,
    },
  }
);
