"use server";

import { db } from "@/lib/db";
import { chat } from "../db/schema";
import { eq } from "drizzle-orm";

export async function getfile(chatId: string) {
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
    console.error("Database error:", err);
    return { error: "Failed to fetch chat data" };
  }
}
