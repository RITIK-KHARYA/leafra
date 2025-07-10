import { db } from "@/lib/db";
import { messages } from "../db/schema";

export default async function newmessage(
  chatId: string,
  message: string,
  role: "user" | "system"
) {
  try {
    await db.insert(messages).values({
      chatId,
      role,
      content: message,
    });
  } catch (error) {
    console.log(error, "error bro");
  }
}
