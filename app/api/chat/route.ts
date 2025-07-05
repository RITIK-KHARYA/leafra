import { getResultFromQuery } from "@/lib/pinecone";
import { togetherai } from "@ai-sdk/togetherai";
import { generateText, smoothStream, streamText } from "ai";
import { NextResponse } from "next/server";
import { getSystemPrompt } from "../services/system-prompt";
import { getChats } from "@/app/actions/chat";
import newmessage from "@/app/actions/newmessage";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages, chatId } = await req.json();
    if (chatId === undefined || null || chatId === "") {
      return NextResponse.json({ error: "No chatId provided" });
    }
    const lastMessage = messages[messages.length - 1];

    console.log("sending the message to the db");
    await newmessage(chatId, lastMessage.content, "user");
    console.log("last messsage was added to db");

    console.log(lastMessage);
    const context = await getResultFromQuery(lastMessage.content);
    const result = await streamText({
      model: togetherai("deepseek-ai/DeepSeek-V3"),
      system: getSystemPrompt(context, lastMessage.content),
      messages,
      experimental_transform: smoothStream({
        delayInMs: 20, // optional: defaults to 10ms
        chunking: "word", // optional: defaults to 'word'
      }),
      onFinish: async (text) => {
        if (typeof text === "string") {
          console.log("text", text);
          await newmessage(chatId, text, "system");
        }
      },
    });
    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Error reading the messages from the request body:", error);
  }
}
