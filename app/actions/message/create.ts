"use server";

import { db } from "@/lib/db";
import { messages } from "@/lib/db/schema";

export async function createMessage(
  chatId: string,
  message: string,
  role: "user" | "system"
) {
  try {
    await db.insert(messages).values({
      chatId,
      role,
      content: message,
    });
  } catch (error) {
    console.log(error, "error bro");
  }
}

