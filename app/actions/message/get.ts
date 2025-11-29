import { db } from "@/lib/db";
import { messages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { ParamValue } from "next/dist/server/request/params";
import { logger } from "@/lib/logger";

export async function getMessages(chatId: ParamValue) {
  try {
    if (!chatId) return [];
    const messagesList = await db
      .select()
      .from(messages)
      .where(eq(messages.chatId, chatId.toString()));
    return messagesList;
  } catch (error) {
    logger.error("Error getting messages", error, {
      chatId: chatId?.toString(),
    });
    return [];
  }
}
