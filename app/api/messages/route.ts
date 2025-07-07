import { NextRequest, NextResponse } from "next/server";
import getmessages from "@/app/actions/getmessages";


export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const chatId = req.nextUrl.searchParams.get("chatId");
  if (!chatId) return NextResponse.json([], { status: 200 });
  const messages = await getmessages(chatId);
  return NextResponse.json(messages || []);
}
