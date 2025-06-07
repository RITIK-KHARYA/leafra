"use server";

import { db } from "@/lib";
import { chat } from "../db/schema";
import { eq } from "drizzle-orm";

export async function getChats(userId: string) {
  const chats = await db.select().from(chat).where(eq(chat.userId, userId));
  if (!chats) {
    console.log("No chats found");
    return {
      data: null,
      error: "No chats found",
      status: 404,
    };
  }
  return {
    data: chats,
    error: null,
    status: 200,
  };
}
