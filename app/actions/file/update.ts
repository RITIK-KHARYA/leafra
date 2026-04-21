"use server";

import { db } from "@/lib/db";
import { chat } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { logger } from "@/lib/logger";
import {
  sanitizeFilename,
  sanitizeUrl,
  sanitizeUuid,
} from "@/lib/security/sanitize";
import { ValidationError } from "@/lib/errors";

export async function updateFile(
  chatId: string,
  pdfUrl: string,
  pdfName: string,
  pdfSize?: number,
) {
  const safeChatId = sanitizeUuid(chatId);
  const safeUrl = sanitizeUrl(pdfUrl); // throws on javascript:/data:/file: etc.
  const safeName = sanitizeFilename(pdfName);
  const safeSize =
    typeof pdfSize === "number" &&
    Number.isFinite(pdfSize) &&
    pdfSize >= 0 &&
    pdfSize < 1_000_000_000 // < 1GB sanity cap
      ? Math.floor(pdfSize)
      : undefined;

  try {
    logger.info("Updating file in database", {
      chatId: safeChatId,
      pdfUrl: safeUrl,
      pdfName: safeName,
      pdfSize: safeSize,
    });
    const result = await db
      .update(chat)
      .set({
        pdfUrl: safeUrl,
        pdfName: safeName,
        ...(safeSize !== undefined ? { pdfSize: safeSize } : {}),
      })
      .where(eq(chat.id, safeChatId));

    logger.info("Database update result", {
      chatId: safeChatId,
      rowCount: result.rowCount || 0,
    });

    if (result.rowCount === 0) {
      logger.warn("No rows updated - chat may not exist", {
        chatId: safeChatId,
      });
      throw new ValidationError(
        `Chat with id ${safeChatId} not found or no rows updated`,
      );
    }

    logger.info("File successfully updated in database", {
      chatId: safeChatId,
      pdfUrl: safeUrl,
      pdfName: safeName,
      pdfSize: safeSize,
    });
  } catch (error) {
    logger.error("Error updating file", error, {
      chatId: safeChatId,
      pdfUrl: safeUrl,
      pdfName: safeName,
      pdfSize: safeSize,
    });
    throw error;
  }
}
