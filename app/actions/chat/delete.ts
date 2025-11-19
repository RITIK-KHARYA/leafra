"use server";

import { db } from "@/lib/db";
import { chat } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function deleteChat(chatId: string) {
  if (!chatId || chatId === "") {
    return {
      data: null,
      error: "Chat ID is required",
      status: 400,
    };
  }

  try {
    await db.delete(chat).where(eq(chat.id, chatId));
    return {
      data: { id: chatId },
      error: null,
      status: 200,
    };
  } catch (error) {
    console.error("Error deleting chat:", error);
    return {
      data: null,
      error: "Failed to delete chat",
      status: 500,
    };
  }
}
