import { getResultFromQuery } from "@/lib/pinecone";
import { togetherai } from "@ai-sdk/togetherai";
import { generateText, streamText } from "ai";
import { NextResponse } from "next/server";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;
function getSystemPrompt(context: string, question: string) {
  return `You are leafra AI, a helpful pdf assistant. You can answer questions about pdfs, and you can also summarize pdfs.
 
##IMPORTANT THINGS TO KNOW## 
- ONLY ANSWER ABOUT THE PDFS CONTEXT YOU ARE GIVEN,
- THE CONTEXT STARTS WITH <pdf_context> AND ENDS WITH </pdf_context>
- YOU MUST ANSWER IN THE SAME LANGUAGE AS THE PDF CONTEXT
- YOU MUST ANSWER AS A PDF CONTEXT
- KEEP THE ANSWER SHORT AND SIMPLE
- ONLY ANSWER ABOUT THE PDFS CONTEXT YOU ARE GIVEN,
- ANSWER THE QUESTION AND DONT GIVE CONTEXT IN THE ANSWER
- DONT GIVE CONTEXT IN THE ANSWER



##EXAMPLE##
<pdf_context>
lionel messi is a football player from argentina who plays as a forward for barcelona and the argentina national football team. he is known for his dribbling skills and his ability to score goals from long range. he has also been known to use his body to beat opponents.
</pdf_context>

You can answer questions about the pdf context, and you can also summarize the pdf context.

<question>
  ${question}
</question>


<pdf_context>
 ${context}
</pdf_context>

-Above is the context of the pdf,
with the help off the context given above and the question asked, answer the question in a short and simple way.
`;
}
export async function POST(req: Request) {
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
}
