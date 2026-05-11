import { Worker } from "bullmq";
import * as dotenv from "dotenv";

// Load env files before touching validated env access so the standalone worker
// sees the same configuration as the app.
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

import { env } from "./env";
import { logger } from "./logger";
import { processUploadedPdf } from "./services/pdf/process-upload";

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
    "Redis is not configured for BullMQ. Worker requires a TCP Redis connection (redis://...), not Upstash REST (https://...).",
  );
  process.exit(1);
}

logger.info("PDF processing worker started");

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

      await processUploadedPdf({
        chatId: job.data.chatId as string,
        fileUrl: job.data.fileUrl as string,
        source: "worker",
        jobId: job.id?.toString(),
      });
    } catch (err) {
      logger.error("Error processing PDF upload job", err, {
        jobId: job.id,
        chatId: job.data.chatId,
        fileUrl: job.data.fileUrl,
      });
      throw err;
    }
  },
  {
    connection: redisConnection,
  },
);

worker.on("completed", (job) => {
  logger.info("Job completed", { jobId: job.id });
});

worker.on("failed", (job, err) => {
  logger.error("Job failed", err, { jobId: job?.id });
});
