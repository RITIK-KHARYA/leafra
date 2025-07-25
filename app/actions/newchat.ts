"use server"; 
import { db } from "@/lib";
import { getSession } from "./chat";
import { chat } from "../db/schema";
import { z } from "zod";
import { newchatschema } from "../types/newchatschema";

export async function newChat(formschema: z.infer<typeof newchatschema>) {
  const user = await getSession();
  if (!user) return { error: "Not logged in", status: 401 };

  try {
    const newChat = await db.insert(chat).values({
      id: crypto.randomUUID(),
      title: formschema.chatName,
      description: formschema.description || "",
      value: formschema.priority,
      userId: formschema.userid?.id,
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
