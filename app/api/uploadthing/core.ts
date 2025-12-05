import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { Queue } from "bullmq";
import { UTApi } from "uploadthing/server";
import { useSonner } from "sonner";
import { updateFile } from "@/app/actions/file/update";
import { auth } from "@/lib/auth";
import { logger } from "@/lib/logger";
import z from "zod";

const f = createUploadthing();

import { env } from "@/lib/env";

// Get Redis connection details from environment variables
// Returns null if Redis is not configured (consistent with rest of codebase)
const getRedisConnection = () => {
  const url = env.UPSTASH_REDIS_REST_URL;
  if (!url || !env.UPSTASH_REDIS_REST_TOKEN) {
    // Return null to indicate Redis is not configured (consistent with rate-limit.ts)
    return null;
  }

  const urlObj = new URL(url);
  return {
    host: urlObj.hostname,
    port: 6379,
    password: env.UPSTASH_REDIS_REST_TOKEN,
  };
};

// Only create queue if Redis is configured
// If Redis is not available, queue operations will need to be handled differently
const redisConnection = getRedisConnection();
const queue = redisConnection
  ? new Queue("upload-pdf", {
      connection: redisConnection,
    })
  : null;

export const ourFileRouter = {
  pdfUploader: f({
    pdf: {
      maxFileSize: "8MB",
      maxFileCount: 1,
    },
  })
    .input(
      z.object({
        chatId: z.string().uuid("chatId must be a valid UUID"),
      })
    )
    .middleware(async ({ req, input }) => {
      // Validate session using better-auth
      const session = await auth.api.getSession({
        headers: req.headers,
      });

      if (!session?.user) {
        throw new UploadThingError("Unauthorized");
      }

      return { userId: session.user.id, chatId: input.chatId };
    })
    .onUploadError(async ({ error, fileKey }) => {
      logger.error("Upload error", error, { fileKey });
    })
    .onUploadComplete(async ({ metadata, file }) => {
      logger.info("Upload complete", {
        userId: metadata.userId,
        fileUrl: file.ufsUrl,
      });

      // Add to queue if Redis is configured, otherwise log a warning
      if (queue) {
      await queue.add("upload-pdf", {
        fileUrl: file.ufsUrl,
        userId: metadata.userId,
        chatId: metadata.chatId,
      });
      } else {
        logger.warn(
          "Redis not configured - PDF processing queue unavailable. File uploaded but not queued for processing.",
          { userId: metadata.userId, fileUrl: file.ufsUrl }
        );
      }

      await updateFile(metadata.chatId, file.ufsUrl, file.name);

      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
