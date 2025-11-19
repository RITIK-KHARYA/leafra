"use server";
import { db } from "@/lib/db";
import { getSession } from "./get";
import { chat } from "@/lib/db/schema";
import { NewChatInput } from "@/types/chat";

export async function createChat(input: NewChatInput) {
  const user = await getSession();
  if (!user) return { error: "Not logged in", status: 401 };

  try {
    const newChat = await db.insert(chat).values({
      id: crypto.randomUUID(),
      title: input.chatName,
      description: input.description || "",
      value: input.priority,
      userId: input.userid?.id,
    });
    return {
      data: newChat[0],
      success: "New chat created",
      status: 200,
    };
  } catch (error) {
    console.log(error);
    return {
      error: "Failed to create new chat",
      status: 500,
    };
  }
}

