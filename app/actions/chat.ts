import { chat } from "../db/schema";
import * as schema from "../db/schema";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { eq } from "drizzle-orm";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, { schema });

export async function getChats(userId: string) {
  const findchat = await db.query.chat.findFirst({
    where: eq(chat.userId, userId),
  });

  if (!findchat) {
    console.log("No chats found");
    return {
      data: null,
      error: "No chats found",
      status: 404,
    };
  }
  return {
    data: findchat,
    error: null,
    status: 200,
  };
}
