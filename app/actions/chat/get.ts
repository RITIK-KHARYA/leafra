"use server";

import { chat } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { headers } from "next/headers";
import { logger } from "@/lib/logger";

export const getSession = async () => {
  try {
    return auth.api.getSession({
      headers: await headers(),
    });
  } catch (error) {
    // Log the error for debugging but don't throw to prevent cascading failures
    logger.error("Failed to get session", error);

    // Return null session instead of throwing to allow graceful degradation
    return null;
  }
};

export async function getChats() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session || !session.user) {
    return {
      data: [],
      error: "No authenticated user found",
      status: 401,
    };
  }
  try {
    const findchat = await db
      .select({
        id: chat.id,
        description: chat.description,
        title: chat.title,
        value: chat.value,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt,
        userId: chat.userId,
        pdfUrl: chat.pdfUrl,
        pdfName: chat.pdfName,
        pdfSize: chat.pdfSize,
      })
      .from(chat)
      .where(eq(chat.userId, session.user.id))
      .orderBy(chat.createdAt);

    if (!findchat || findchat.length === 0) {
      logger.debug("No chats found for user", { userId: session.user.id });
      return {
        data: [],
        error: "No chats found",
        status: 404,
      };
    }
    return {
      data: findchat,
      error: null,
      status: 200,
    };
  } catch (error) {
    logger.error("Error getting chats", error, { userId: session.user?.id });
    return {
      data: [],
      error: "Failed to get chats",
      status: 500,
    };
  }
}
