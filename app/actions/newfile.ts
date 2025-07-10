"use server";

// export const runtime = "nodejs";

import { db } from "@/lib/db";
import { chat } from "../db/schema";
import { eq } from "drizzle-orm";

export default async function newfile(
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
    console.log("new file error",error);
  }
}
