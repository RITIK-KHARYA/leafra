"use server";

import { db } from "@/lib";
import { chat } from "../db/schema";
import { eq } from "drizzle-orm";

export async function deleteChat(chatId: string) {
  const existingChat = await db.delete(chat).where(eq(chat.id, chatId));
  if (!existingChat || existingChat.length === 0 || chatId === "") {
    return {
      data: null,
      error: "Chat not found",
      status: 404,
    };
  }
  return {
    data: existingChat,
    error: null,
    status: 200,
  };
}
