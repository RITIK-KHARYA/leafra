"use server";
import { db } from "@/lib/db";
import { getSession } from "./get";
import { chat } from "@/lib/db/schema";
import { NewChatInput } from "@/types/chat";
import { eq } from "drizzle-orm";
import { logger } from "@/lib/logger";

export async function createChat(input: NewChatInput) {
  const user = await getSession();
  if (!user || !user.user?.id) return { error: "Not logged in", status: 401 };

  const userId = input.userid?.id || user.user.id;
  if (!userId) return { error: "User ID is required", status: 400 };

  try {
    const chatId = crypto.randomUUID();
    await db.insert(chat).values({
      id: chatId,
      title: input.chatName,
      description: input.description || "",
      value: input.priority,
      userId: userId,
    });

    // Fetch the created chat
    const newChat = await db
      .select()
      .from(chat)
      .where(eq(chat.id, chatId))
      .limit(1);

    return {
      data: newChat[0],
      success: "New chat created",
      status: 200,
    };
  } catch (error) {
    logger.error("Error creating chat", error, {
      userId,
      chatName: input.chatName,
    });
    return {
      error: "Failed to create new chat",
      status: 500,
    };
  }
}
