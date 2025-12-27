"use server";

import { db } from "@/lib/db";
import { chat } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { logger } from "@/lib/logger";

export async function updateFile(
  chatId: string,
  pdfUrl: string,
  pdfName: string
) {
  try {
    logger.info("Updating file in database", { chatId, pdfUrl, pdfName });
    const result = await db
      .update(chat)
      .set({
        pdfUrl,
        pdfName,
      })
      .where(eq(chat.id, chatId));

    logger.info("Database update result", {
      chatId,
      rowCount: result.rowCount || 0,
    });

    if (result.rowCount === 0) {
      logger.warn("No rows updated - chat may not exist", { chatId });
      throw new Error(`Chat with id ${chatId} not found or no rows updated`);
    }

    logger.info("File successfully updated in database", {
      chatId,
      pdfUrl,
      pdfName,
    });
  } catch (error) {
    logger.error("Error updating file", error, { chatId, pdfUrl, pdfName });
    throw error;
  }
}
