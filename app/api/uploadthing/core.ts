import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { updateFile } from "@/app/actions/file/update";
import { logger } from "@/lib/logger";
import { ensureChatOwnership } from "@/lib/services/auth/chat-authorization";
import {
  AuthorizationError,
  NotFoundError,
  ValidationError,
} from "@/lib/errors";
import { addDocument, purgeDocuments } from "@/lib/integrations/supermemory";
import { sanitizeFilename, sanitizeUrl } from "@/lib/security/sanitize";
import z from "zod";

const f = createUploadthing();

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

      // Re-uploads: clear the chat's previous documents before adding new
      // ones so old PDF content cannot bleed into answers.
      try {
        await purgeDocuments(metadata.chatId);
      } catch (purgeError) {
        logger.warn(
          "Failed to purge previous documents (continuing with add)",
          {
            error: purgeError,
            chatId: metadata.chatId,
          },
        );
      }

      // Sanitize file name before sending to external services.
      let safeFileNameForSM: string;
      try {
        safeFileNameForSM = sanitizeFilename(file.name);
      } catch {
        safeFileNameForSM = "unknown.pdf";
      }

      // Send the PDF URL to SuperMemory for processing (chunking, embedding,
      // indexing). SuperMemory handles everything asynchronously.
      try {
        await addDocument(file.ufsUrl, metadata.chatId, undefined, {
          source: "uploadthing",
          fileName: safeFileNameForSM,
        });
      } catch (smError) {
        logger.warn(
          "Failed to add document to SuperMemory (file still saved to DB)",
          {
            error: smError,
            chatId: metadata.chatId,
            fileUrl: file.ufsUrl,
          },
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
