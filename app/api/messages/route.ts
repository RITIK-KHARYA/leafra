import { NextRequest } from "next/server";
import { getMessages } from "@/app/actions/message/get";
import { headers } from "next/headers";
import { z } from "zod";
import { ApiResponse } from "@/lib/api-response";
import { ensureChatOwnership } from "@/lib/services/auth/chat-authorization";
import { AuthorizationError, NotFoundError } from "@/lib/errors";

const chatIdSchema = z.string().uuid("chatId must be a valid UUID");

export async function GET(req: NextRequest) {
  // Authenticate user
  const { auth } = await import("@/lib/auth");
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
    return ApiResponse.badRequest(
      "Invalid chatId format",
      validationResult.error.errors
    );
  }

  // Validate chat ownership
  try {
    await ensureChatOwnership(validationResult.data, session.user.id);
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return ApiResponse.error(error.message, error.statusCode);
    }
    if (error instanceof NotFoundError) {
      return ApiResponse.notFound(error.message);
    }
    throw error;
  }

  const messages = await getMessages(validationResult.data);
  return ApiResponse.success(messages || []);
}
