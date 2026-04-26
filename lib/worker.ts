import { Worker } from "bullmq";
import * as dotenv from "dotenv";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";

// Load `.env.local` BEFORE importing any module that touches the validated
// env schema. Next.js conventionally uses `.env.local`, not `.env`, so the
// worker (run standalone via `dev:worker`) was previously starting with an
// unvalidated environment.
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

import { getPineconeClient } from "./integrations/pinecone";
import { env, requireEnv } from "./env";
import { logger } from "./logger";

interface Vector {
  id: string;
  values: number[];
  metadata: {
    pageNumber: number;
    content: string;
  };
}

// Get Redis connection details from environment variables.
// Returns null if Redis is not configured, or if the URL is HTTP(S)
// (Upstash REST cannot be used with BullMQ which requires raw TCP).
const getRedisConnection = () => {
  const url = env.UPSTASH_REDIS_REST_URL?.trim();
  if (!url || !env.UPSTASH_REDIS_REST_TOKEN) return null;
  if (url.startsWith("https://") || url.startsWith("http://")) return null;

  const urlObj = new URL(url);
  return {
    host: urlObj.hostname,
    port: urlObj.port ? Number(urlObj.port) : 6379,
    password: env.UPSTASH_REDIS_REST_TOKEN,
  };
};

const redisConnection = getRedisConnection();

if (!redisConnection) {
  logger.error(
    "Redis is not configured or using REST URL. Worker requires a TCP Redis connection (BullMQ does not support Upstash REST). Set UPSTASH_REDIS_REST_URL (redis://...) and UPSTASH_REDIS_REST_TOKEN."
  );
  process.exit(1);
}

logger.info("PDF processing worker started");

// 🌲 Pinecone setup
const pinecone = getPineconeClient();
const pineconeIndex = pinecone.index("leafravectordb");

// 🧠 Embeddings setup (same model as retrieval for consistent vectors)
const embeddings = new GoogleGenerativeAIEmbeddings({
  model: "gemini-embedding-001",
  apiKey: requireEnv("GEMINI_AI_API_KEY", "PDF ingestion worker"),
  taskType: TaskType.RETRIEVAL_DOCUMENT,
});

// 🧾 PDF Upload Worker
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

      const fileUrl = job.data.fileUrl as string;
      const chatId = job.data.chatId as string;

      const response = await fetch(fileUrl);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch PDF: ${response.status} ${response.statusText}`
        );
      }

      const buffer = Buffer.from(await response.arrayBuffer());
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
        chatId,
      });

      const docsPromise = docs.map(async (doc, idx) => {
        const pageNumber = Number(doc.metadata?.loc?.pageNumber ?? 0);
        const content = doc.pageContent.replace(/\n/g, "");
        return {
          id: `${fileUrl}-${pageNumber}-${idx}`,
          values: await embeddings.embedQuery(content),
          metadata: {
            pageNumber,
            content,
          },
        } satisfies Vector;
      });

      const docsWithVectors = await Promise.all(docsPromise);

      const namespace = pineconeIndex.namespace(chatId);

      await namespace.upsert(docsWithVectors);

      logger.info("PDF embedded and stored in Pinecone", {
        jobId: job.id,
        chatId,
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

worker.on("completed", (job) => {
  logger.info("Job completed", { jobId: job.id });
});

worker.on("failed", (job, err) => {
  logger.error("Job failed", err, { jobId: job?.id });
});
