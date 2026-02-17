import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { Queue } from "bullmq";
import { UTApi } from "uploadthing/server";
import { useSonner } from "sonner";
import { updateFile } from "@/app/actions/file/update";
import { logger } from "@/lib/logger";
import { ensureChatOwnership } from "@/lib/services/auth/chat-authorization";
import { AuthorizationError, NotFoundError } from "@/lib/errors";
import z from "zod";

const f = createUploadthing();

import { env } from "@/lib/env";

// BullMQ requires TCP Redis. Upstash uses REST (HTTPS), so only create queue for classic Redis.
const getRedisConnectionForBullMQ = () => {
  const url = env.UPSTASH_REDIS_REST_URL;
  if (!url || !env.UPSTASH_REDIS_REST_TOKEN) return null;
  if (url.startsWith("https://") || url.startsWith("http://")) return null;
  const urlObj = new URL(url);
  return {
    host: urlObj.hostname,
    port: 6379,
    password: env.UPSTASH_REDIS_REST_TOKEN,
  };
};

const redisConnection = getRedisConnectionForBullMQ();
const queue = redisConnection
  ? new Queue("upload-pdf", { connection: redisConnection })
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
      const { auth } = await import("@/lib/auth");
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

      // Add to queue if Redis is configured (non-blocking: DB update must always run)
      if (queue) {
        try {
          await queue.add("upload-pdf", {
            fileUrl: file.ufsUrl,
            userId: metadata.userId,
            chatId: metadata.chatId,
          });
        } catch (queueError) {
          logger.warn(
            "Failed to add PDF to processing queue (file still saved to DB)",
            {
              error: queueError,
              chatId: metadata.chatId,
              fileUrl: file.ufsUrl,
            }
          );
        }
      } else {
        logger.warn(
          "Redis not configured - PDF processing queue unavailable. File uploaded but not queued for processing.",
          { userId: metadata.userId, fileUrl: file.ufsUrl }
        );
      }

      // Verify chat exists and user owns it before updating
      try {
        await ensureChatOwnership(metadata.chatId, metadata.userId);
        logger.info("Chat ownership verified", {
          chatId: metadata.chatId,
          userId: metadata.userId,
        });
      } catch (error) {
        if (error instanceof NotFoundError) {
          logger.error("Chat not found - cannot save file", error, {
            chatId: metadata.chatId,
            userId: metadata.userId,
            fileUrl: file.ufsUrl,
          });
          // Don't throw - upload succeeded, but chat doesn't exist
          return { uploadedBy: metadata.userId };
        }
        if (error instanceof AuthorizationError) {
          logger.error("User does not own chat - cannot save file", error, {
            chatId: metadata.chatId,
            userId: metadata.userId,
            fileUrl: file.ufsUrl,
          });
          // Don't throw - upload succeeded, but user doesn't own chat
          return { uploadedBy: metadata.userId };
        }
        // Re-throw unexpected errors
        throw error;
      }

      // Update database with file URL
      try {
        logger.info("Attempting to save file to database", {
          chatId: metadata.chatId,
          fileUrl: file.ufsUrl,
          fileName: file.name,
        });
        await updateFile(metadata.chatId, file.ufsUrl, file.name);
        logger.info("File successfully saved to database", {
          chatId: metadata.chatId,
          fileUrl: file.ufsUrl,
        });
      } catch (error) {
        logger.error("Failed to save file to database", error, {
          chatId: metadata.chatId,
          fileUrl: file.ufsUrl,
          fileName: file.name,
        });
        // Don't throw - upload succeeded, DB update failed
      }

      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
