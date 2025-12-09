import { Worker } from "bullmq";
import fetch from "node-fetch";
import * as dotenv from "dotenv";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { TogetherAIEmbeddings } from "@langchain/community/embeddings/togetherai";
import { Pinecone } from "@pinecone-database/pinecone";
import { getPineconeClient } from "./integrations/pinecone";
import { getRedisClient } from "./integrations/redis";
import { env } from "./env";
import { logger } from "./logger";

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

// Get Redis connection details from environment variables
// Returns null if Redis is not configured (consistent with rest of codebase)
const getRedisConnection = () => {
  const url = env.UPSTASH_REDIS_REST_URL.trim();
  if (!url || !env.UPSTASH_REDIS_REST_TOKEN) {
    // Return null to indicate Redis is not configured
    return null;
  }

  const urlObj = new URL(url);
  return {
    host: urlObj.hostname,
    port: 6379,
    password: env.UPSTASH_REDIS_REST_TOKEN,
  };
};

// Check if Redis is configured before starting the worker
const redisConnection = getRedisConnection();

if (!redisConnection) {
  logger.error(
    "Redis is not configured. Worker requires Redis to function. Please set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN environment variables."
  );
  process.exit(1);
}

logger.info("PDF processing worker started");

// 🌲 Pinecone setup
const pinecone = getPineconeClient();
const pineconeIndex = pinecone.index("leafravectordb");

// 🧠 Embeddings setup
const embeddingAI = new TogetherAIEmbeddings({
  model: env.TOGETHER_AI_MODEL,
  apiKey: env.TOGETHER_AI_API_KEY,
});

// 🧾 PDF Upload Worker
// Only create worker if Redis is configured
const worker = new Worker(
  "upload-pdf",
  async (job) => {
    try {
      if (job.name !== "upload-pdf") {
        logger.warn("Unknown job type", { jobName: job.name });
        return;
      }

      logger.info("Processing PDF upload job", {
        jobId: job.id,
        chatId: job.data.chatId,
        fileUrl: job.data.fileUrl,
      });

      const fileUrl = job.data.fileUrl;
      const response = await fetch(fileUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch PDF: ${response.status} ${response.statusText}`);
      }

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

      logger.debug("PDF split into chunks", {
        totalChunks: docs.length,
        chatId: job.data.chatId,
      });

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

      await namespace.upsert(docsWithVectors);
      
      logger.info("PDF embedded and stored in Pinecone", {
        jobId: job.id,
        chatId: job.data.chatId,
        vectorCount: docsWithVectors.length,
      });
    } catch (err) {
      logger.error("Error processing PDF upload job", err, {
        jobId: job.id,
        chatId: job.data.chatId,
        fileUrl: job.data.fileUrl,
      });
      // Re-throw error so BullMQ can handle retries
      throw err;
    }
  },
  {
    connection: redisConnection,
  }
);
