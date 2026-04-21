import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { Queue } from "bullmq";
import { updateFile } from "@/app/actions/file/update";
import { logger } from "@/lib/logger";
import { ensureChatOwnership } from "@/lib/services/auth/chat-authorization";
import {
  AuthorizationError,
  NotFoundError,
  ValidationError,
} from "@/lib/errors";
import { getPineconeClient } from "@/lib/integrations/pinecone";
import { sanitizeFilename, sanitizeUrl } from "@/lib/security/sanitize";
import z from "zod";

const f = createUploadthing();

import { env } from "@/lib/env";

// BullMQ requires TCP Redis. Upstash REST (HTTPS) is not compatible.
const getRedisConnectionForBullMQ = () => {
  const url = env.UPSTASH_REDIS_REST_URL;
  if (!url || !env.UPSTASH_REDIS_REST_TOKEN) return null;
  if (url.startsWith("https://") || url.startsWith("http://")) return null;
  const urlObj = new URL(url);
  return {
    host: urlObj.hostname,
    port: urlObj.port ? Number(urlObj.port) : 6379,
    password: env.UPSTASH_REDIS_REST_TOKEN,
  };
};

const redisConnection = getRedisConnectionForBullMQ();
const queue = redisConnection
  ? new Queue("upload-pdf", { connection: redisConnection })
  : null;

async function purgePreviousVectors(chatId: string) {
  try {
    const pinecone = getPineconeClient();
    const namespace = pinecone.index("leafravectordb").namespace(chatId);
    await namespace.deleteAll();
    logger.info("Purged existing vectors for chat namespace", { chatId });
  } catch (error) {
    // Pinecone returns 404 for empty / missing namespaces - treat as no-op.
    const message =
      error instanceof Error ? error.message : String(error);
    if (/not\s*found|404/i.test(message)) {
      logger.debug("No existing namespace to purge", { chatId });
      return;
    }
    logger.warn("Failed to purge previous vectors (continuing)", {
      chatId,
      error: message,
    });
  }
}

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

      // Verify chat exists and user owns it before any side effects.
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
          return { uploadedBy: metadata.userId };
        }
        if (error instanceof AuthorizationError) {
          logger.error("User does not own chat - cannot save file", error, {
            chatId: metadata.chatId,
            userId: metadata.userId,
            fileUrl: file.ufsUrl,
          });
          return { uploadedBy: metadata.userId };
        }
        throw error;
      }

      // Re-uploads: clear the chat's previous Pinecone namespace before
      // enqueuing new vectors so old PDF content cannot bleed into answers.
      await purgePreviousVectors(metadata.chatId);

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

      // Sanitize attacker-controlled fields before persisting them. UploadThing
      // hosts the file itself, but file.name comes from the client and could
      // contain path-traversal / control chars / homograph spoofing.
      let safeFileUrl: string;
      let safeFileName: string;
      try {
        safeFileUrl = sanitizeUrl(file.ufsUrl);
        safeFileName = sanitizeFilename(file.name);
      } catch (sanitizeError) {
        if (sanitizeError instanceof ValidationError) {
          logger.error(
            "Rejected uploaded file due to invalid URL or filename",
            sanitizeError,
            {
              chatId: metadata.chatId,
              userId: metadata.userId,
              fileUrl: file.ufsUrl,
              fileName: file.name,
            },
          );
          return { uploadedBy: metadata.userId };
        }
        throw sanitizeError;
      }

      // Update database with file URL
      try {
        logger.info("Attempting to save file to database", {
          chatId: metadata.chatId,
          fileUrl: safeFileUrl,
          fileName: safeFileName,
          fileSize: file.size,
        });
        await updateFile(
          metadata.chatId,
          safeFileUrl,
          safeFileName,
          typeof file.size === "number" ? file.size : undefined
        );
        logger.info("File successfully saved to database", {
          chatId: metadata.chatId,
          fileUrl: safeFileUrl,
        });
      } catch (error) {
        logger.error("Failed to save file to database", error, {
          chatId: metadata.chatId,
          fileUrl: safeFileUrl,
          fileName: safeFileName,
        });
        // Don't throw - upload succeeded, DB update failed
      }

      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
