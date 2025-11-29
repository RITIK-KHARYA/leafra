"use server";

import { db } from "@/lib/db";
import { chat } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { logger } from "@/lib/logger";

export async function getFile(chatId: string) {
  if (!chatId) return { error: "ChatId is required" };

  try {
    const result = await db
      .select({
        pdfUrl: chat.pdfUrl,
        pdfName: chat.pdfName,
        pdfSize: chat.pdfSize,
      })
      .from(chat)
      .where(eq(chat.id, chatId));

    if (result.length === 0) {
      return { error: "Chat not found" };
    }

    const chatData = result[0];

    if (!chatData.pdfUrl) {
      return { error: "No PDF URL found for this chat" };
    }

    return {
      success: true,
      data: {
        pdfUrl: chatData.pdfUrl,
        pdfName: chatData.pdfName,
        pdfSize: chatData.pdfSize,
      },
    };
  } catch (err) {
    logger.error("Database error getting file", err, { chatId });
    return { error: "Failed to fetch chat data" };
  }
}

