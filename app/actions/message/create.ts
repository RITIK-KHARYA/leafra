"use server";

import { db } from "@/lib/db";
import { messages } from "@/lib/db/schema";
import { logger } from "@/lib/logger";
import { DatabaseError } from "@/lib/errors";

export async function createMessage(
  chatId: string,
  message: string,
  role: "user" | "system"
): Promise<void> {
  try {
    await db.insert(messages).values({
      chatId,
      role,
      content: message,
    });
  } catch (error) {
    logger.error("Error creating message", error, { chatId, role });
    throw new DatabaseError("Failed to create message", error);
  }
}
