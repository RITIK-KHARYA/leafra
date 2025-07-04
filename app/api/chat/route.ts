import { getResultFromQuery } from "@/lib/pinecone";
import { togetherai } from "@ai-sdk/togetherai";
import { generateText, streamText } from "ai";
import { NextResponse } from "next/server";
import { getSystemPrompt } from "../services/system-prompt";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1];
    console.log(lastMessage);
    const context = await getResultFromQuery(lastMessage.content);
    const { text } = await generateText({
      model: togetherai("deepseek-ai/DeepSeek-V3"),
      system: getSystemPrompt(context, lastMessage.content),
      messages,
    });

    return NextResponse.json({ result: text });
  } catch (error) {
    console.error("Error reading the messages from the request body:", error);
  }
}
