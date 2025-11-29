"use server";

import { chat } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { cache } from "react";
import { db } from "@/lib/db";
import { headers } from "next/headers";
import { logger } from "@/lib/logger";

export const getSession = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session;
});

export async function getChats() {
  const user = await getSession();
  if (!user) {
    return {
      data: [],
      error: "No user found",
      status: 404,
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
      .where(eq(chat.userId, user.user?.id))
      .orderBy(chat.createdAt);

    if (!findchat || findchat.length === 0) {
      logger.debug("No chats found for user", { userId: user.user?.id });
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
    logger.error("Error getting chats", error, { userId: user.user?.id });
    return {
      data: [],
      error: "Failed to get chats",
      status: 500,
    };
  }
}

