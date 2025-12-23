"use server";

import { db } from "@/lib/db";
import { chat } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "./get";
import { ensureChatOwnership } from "@/lib/services/auth/chat-authorization";
import { logger } from "@/lib/logger";
import { AuthorizationError, NotFoundError } from "@/lib/errors";

export async function deleteChat(chatId: string) {
  if (!chatId || chatId === "") {
    return {
      data: null,
      error: "Chat ID is required",
      status: 400,
    };
  }

  // Get session and validate
  const session = await getSession();
  if (!session || !session.user) {
    return {
      data: null,
      error: "Not authenticated",
      status: 401,
    };
  }

  // Validate chat ownership
  try {
    await ensureChatOwnership(chatId, session.user.id);
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return {
        data: null,
        error: error.message,
        status: error.statusCode,
      };
    }
    if (error instanceof NotFoundError) {
      return {
        data: null,
        error: error.message,
        status: 404,
      };
    }
    throw error;
  }

  try {
    await db.delete(chat).where(eq(chat.id, chatId));
    return {
      data: { id: chatId },
      error: null,
      status: 200,
    };
  } catch (error) {
    logger.error("Error deleting chat", error, { chatId });
    return {
      data: null,
      error: "Failed to delete chat",
      status: 500,
    };
  }
}
