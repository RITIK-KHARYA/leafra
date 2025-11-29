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
    await db
      .update(chat)
      .set({
        pdfUrl,
        pdfName,
      })
      .where(eq(chat.id, chatId));
  } catch (error) {
    logger.error("Error updating file", error, { chatId, pdfUrl, pdfName });
    throw new Error("Failed to update file");
  }
}
