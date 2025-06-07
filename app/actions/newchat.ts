"use server";

import { db } from "@/lib";
import { getSession } from "@/lib/auth-client";
import { chat } from "../db/schema";

export async function newChat() {
  const user = await getSession();
  if (!user) throw new Error("Unauthorized");

  try {
    const newChat = await db.insert(chat).values({
      id: crypto.randomUUID(),
      userId: user.data.user.id,
      pdfUrl: "",
      pdfName: "",
      pdfSize: 0,
    });

    return {
      data: newChat,
      success: "New chat created",
    };
  } catch (error) {
    console.log(error);
    return {
      error: "Failed to create new chat",
      status: 500,
    };
  }
}
