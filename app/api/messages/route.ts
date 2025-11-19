import { NextRequest, NextResponse } from "next/server";
import { getMessages } from "@/app/actions/message/get";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const chatId = req.nextUrl.searchParams.get("chatId");
  if (!chatId) return NextResponse.json([], { status: 200 });
  const messages = await getMessages(chatId);
  return NextResponse.json(messages || []);
}
