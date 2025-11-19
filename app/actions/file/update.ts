"use server";

import { db } from "@/lib/db";
import { chat } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function updateFile(
  chatId: string,
  pdfUrl: string,
  pdfName: string
) {
  try {
    await db
      .update(chat)
      .set({
        pdfUrl,
        pdfName,
      })
      .where(eq(chat.id, chatId));
  } catch (error) {
    console.log("new file error", error);
  }
}

