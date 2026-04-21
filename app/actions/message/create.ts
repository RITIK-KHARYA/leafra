"use server";

import { db } from "@/lib/db";
import { messages } from "@/lib/db/schema";
import { logger } from "@/lib/logger";
import { DatabaseError } from "@/lib/errors";
import { sanitizeText, sanitizeUuid } from "@/lib/security/sanitize";

// Messages can be long (PDF-grounded answers stream thousands of tokens).
const MAX_MESSAGE_LEN = 50_000;

export async function createMessage(
  chatId: string,
  message: string,
  role: "user" | "system",
): Promise<void> {
  try {
    const safeChatId = sanitizeUuid(chatId);
    const safeContent = sanitizeText(message, { maxLen: MAX_MESSAGE_LEN });
    if (safeContent.length === 0) {
      // Persisting empty content breaks downstream re-hydration of /api/chat.
      throw new DatabaseError("Refusing to persist empty message");
    }

    await db.insert(messages).values({
      chatId: safeChatId,
      role,
      content: safeContent,
    });
  } catch (error) {
    logger.error("Error creating message", error, { chatId, role });
    if (error instanceof DatabaseError) throw error;
    throw new DatabaseError("Failed to create message", error);
  }
}
