import { db } from "@/db";
import { messages } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { ParamValue } from "next/dist/server/request/params";

export const runtime = "nodejs";


export default async function getmessages(chatId: ParamValue) {
  try {
    if (!chatId) return;
    const messagesList = await db
      .select()
      .from(messages)
      .where(eq(messages.chatId, chatId.toString()));
    console.log(messagesList);
    return messagesList;
  } catch (error) {
    console.log(error, "internal error");
  }
}
