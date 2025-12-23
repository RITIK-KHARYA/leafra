import { db } from "@/lib/db";
import { chat } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { logger } from "@/lib/logger";
import { AuthorizationError, NotFoundError } from "@/lib/errors";

/**
 * Validates chat ownership and throws appropriate errors if validation fails.
 * Uses a single database query to check both existence and ownership.
 *
 * @param chatId - The chat ID to validate
 * @param userId - The user ID to check ownership against
 * @throws NotFoundError if the chat doesn't exist (404)
 * @throws AuthorizationError if the chat exists but doesn't belong to the user (403)
 * @throws AuthorizationError if database query fails (500)
 */
export async function ensureChatOwnership(
  chatId: string,
  userId: string
): Promise<void> {
  try {
    // Single query to get chat with userId for ownership check
    const result = await db
      .select({ id: chat.id, userId: chat.userId })
      .from(chat)
      .where(eq(chat.id, chatId))
      .limit(1);

    if (result.length === 0) {
      throw new NotFoundError("Chat not found");
    }

    if (result[0].userId !== userId) {
      throw new AuthorizationError("You do not have access to this chat", 403);
    }
  } catch (error) {
    // Re-throw if it's already an AppError (NotFoundError or AuthorizationError)
    if (error instanceof AuthorizationError || error instanceof NotFoundError) {
      throw error;
    }
    // Otherwise log and throw generic error for database failures
    logger.error("Error ensuring chat ownership", error, { chatId, userId });
    throw new AuthorizationError("Failed to verify chat access", 500);
  }
}

/**
 * Gets a chat with ownership validation.
 * Returns the chat if it exists and belongs to the user, null otherwise.
 *
 * @param chatId - The chat ID to retrieve
 * @param userId - The user ID to check ownership against
 * @returns The chat object if it exists and belongs to the user, null otherwise
 */
export async function getChatWithOwnership(
  chatId: string,
  userId: string
): Promise<typeof chat.$inferSelect | null> {
  try {
    const result = await db
      .select()
      .from(chat)
      .where(eq(chat.id, chatId))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    // Check ownership
    if (result[0].userId !== userId) {
      return null;
    }

    return result[0];
  } catch (error) {
    logger.error("Error getting chat with ownership", error, {
      chatId,
      userId,
    });
    return null;
  }
}
