"use server";

import { chat } from "../db/schema";
import * as schema from "../db/schema";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { eq } from "drizzle-orm";
import { cookies, headers } from "next/headers";
import { auth } from "@/lib/auth";
import { cache } from "react";
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const db = drizzle(pool, { schema });

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
  console.log("i am him",user);
  try {
    const findchat = await db.query.chat.findMany({
      where: eq(chat.userId, user.user?.id),
      orderBy: chat.createdAt,
      columns: {
        id: true,
        description: true,
        title: true,
        value: true,
        createdAt: true,
        updatedAt: true,
        userId: true,
        pdfUrl: true,
        pdfName: true,
        pdfSize: true,
      },
    });
    if (!findchat || findchat === null || findchat === undefined) {
      console.log("No chats found");
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
    console.log(error);
    return {
      data: [],
      error: "Failed to get chats",
      status: 500,
    };
  }
}
