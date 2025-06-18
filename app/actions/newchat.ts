"use server";

import { db } from "@/lib";
import { getSession } from "@/lib/auth-client";
import { chat } from "../db/schema";

// adding form data here

export async function newChat() {
  const user = await getSession();
  if (!user) throw new Error("Unauthorized");

  try {
    const newChat = await db.insert(chat).values({
      id: crypto.randomUUID(),
      title: "New Chat",
      userId: user.data.user.id,
      pdfUrl: "",
      pdfName: "",
      pdfSize: 0,
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
