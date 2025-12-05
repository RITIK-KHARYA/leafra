import { NextRequest } from "next/server";
import { getMessages } from "@/app/actions/message/get";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { z } from "zod";
import { ApiResponse } from "@/lib/api-response";

const chatIdSchema = z.string().uuid("chatId must be a valid UUID");

export async function GET(req: NextRequest) {
  // Authenticate user
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return ApiResponse.unauthorized();
  }

  const chatId = req.nextUrl.searchParams.get("chatId");
  
  if (!chatId) {
    return ApiResponse.success([]);
  }

  // Validate chatId format
  const validationResult = chatIdSchema.safeParse(chatId);
  if (!validationResult.success) {
    return ApiResponse.badRequest("Invalid chatId format", validationResult.error.errors);
  }

  const messages = await getMessages(validationResult.data);
  return ApiResponse.success(messages || []);
}
