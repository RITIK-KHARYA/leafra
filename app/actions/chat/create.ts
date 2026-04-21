"use server";
import { db } from "@/lib/db";
import { getSession } from "./get";
import { chat } from "@/lib/db/schema";
import { newChatSchema, NewChatInput } from "@/types/chat";
import { eq } from "drizzle-orm";
import { logger } from "@/lib/logger";

export async function createChat(input: NewChatInput) {
  const user = await getSession();
  if (!user || !user.user?.id) return { error: "Not logged in", status: 401 };

  // Defense-in-depth: even though the form already runs this schema,
  // server actions are independently reachable. Always re-validate + sanitize.
  const parsed = newChatSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Invalid input", status: 400 };
  }

  const userId = user.user.id;

  try {
    const chatId = crypto.randomUUID();
    await db.insert(chat).values({
      id: chatId,
      title: parsed.data.chatName,
      description: parsed.data.description,
      value: parsed.data.priority,
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
      chatName: parsed.data.chatName,
    });
    return {
      error: "Failed to create new chat",
      status: 500,
    };
  }
}
