import { getResultFromQuery } from "@/lib/integrations/pinecone";
import { togetherai } from "@ai-sdk/togetherai";
import { generateText, smoothStream, streamText } from "ai";
import { getSystemPrompt } from "@/lib/services/ai/prompts";
import { getChats } from "@/app/actions/chat/get";
import { createMessage } from "@/app/actions/message/create";
import { headers } from "next/headers";
import { z } from "zod";
import { ApiResponse } from "@/lib/api-response";
import { logger } from "@/lib/logger";
import { chatRateLimiter } from "@/lib/rate-limit";
import { ensureChatOwnership } from "@/lib/services/auth/chat-authorization";
import {
  AuthorizationError,
  NotFoundError,
  ValidationError,
} from "@/lib/errors";
import { withRetry } from "@/lib/db/transactions";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Message part schema for parts array format
// At least one of text or content must be present and non-empty
const messagePartSchema = z
  .object({
    type: z.string(),
    text: z.string().optional(),
    content: z.string().optional(),
  })
  .refine(
    (data) => {
      // At least one of text or content must be a non-empty string
      const hasText = typeof data.text === "string" && data.text.length > 0;
      const hasContent =
        typeof data.content === "string" && data.content.length > 0;
      return hasText || hasContent;
    },
    {
      message:
        "Message part must have either a non-empty 'text' or 'content' field",
    }
  );

// Message schema that handles both content (string) and parts (array) formats
const messageSchema = z
  .object({
    role: z.enum(["user", "assistant", "system"]),
    content: z.string().optional(),
    parts: z.array(messagePartSchema).optional(),
    id: z.string().optional(),
  })
  .refine(
    (data) => {
      // If content is provided, it must be non-empty
      if (typeof data.content === "string" && data.content.length > 0) {
        return true;
      }
      // If parts is provided, it must be non-empty and each part must have content
      if (Array.isArray(data.parts) && data.parts.length > 0) {
        // Validate that at least one part has extractable content
        return data.parts.some(
          (part) =>
            (typeof part.text === "string" && part.text.length > 0) ||
            (typeof part.content === "string" && part.content.length > 0)
        );
      }
      return false;
    },
    {
      message:
        "Message must have either a non-empty 'content' string or a non-empty 'parts' array with at least one part containing text or content",
    }
  );

const chatRequestSchema = z.object({
  messages: z.array(messageSchema).min(1, "At least one message is required"),
  chatId: z.string().uuid("chatId must be a valid UUID"),
});

export async function POST(req: Request) {
  try {
    // Authenticate user
    const { auth } = await import("@/lib/auth");
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return ApiResponse.unauthorized();
    }

    // Rate limiting
    const rateLimitResult = await chatRateLimiter.check(session.user.id);
    if (!rateLimitResult.success) {
      return ApiResponse.error("Rate limit exceeded", 429, {
        reset: rateLimitResult.reset,
      });
    }

    // Validate request body
    const body = await req.json();
    const validationResult = chatRequestSchema.safeParse(body);

    if (!validationResult.success) {
      return ApiResponse.badRequest(
        "Invalid request",
        validationResult.error.errors
      );
    }

    const { messages, chatId } = validationResult.data;

    // Validate chat ownership before processing
    try {
      await ensureChatOwnership(chatId, session.user.id);
    } catch (error) {
      if (error instanceof AuthorizationError) {
        return ApiResponse.error(error.message, error.statusCode);
      }
      if (error instanceof NotFoundError) {
        return ApiResponse.notFound(error.message);
      }
      throw error;
    }

    const lastMessage = messages[messages.length - 1];

    // Extract content from message - handle both content (string) and parts (array) formats
    let messageContent: string;
    if (
      typeof lastMessage.content === "string" &&
      lastMessage.content.length > 0
    ) {
      messageContent = lastMessage.content;
    } else if (
      Array.isArray(lastMessage.parts) &&
      lastMessage.parts.length > 0
    ) {
      // Extract text from parts array
      messageContent = lastMessage.parts
        .map((part) => part.text || part.content || "")
        .filter((text) => text.length > 0)
        .join(" ");

      if (messageContent.length === 0) {
        return ApiResponse.badRequest(
          "Last message must have valid content in either 'content' field or 'parts' array"
        );
      }
    } else {
      return ApiResponse.badRequest(
        "Last message must have either a non-empty 'content' string or a non-empty 'parts' array"
      );
    }

    // Get context from Pinecone
    let context: string;
    try {
      context = await getResultFromQuery(messageContent, chatId);
    } catch (error) {
      logger.warn("Failed to get context from Pinecone, using fallback", error);
      context = "No context available";
    }

    // Transform messages to AI SDK format (extract content from parts if needed)
    // Filter out messages with empty content to prevent sending invalid messages to AI
    const transformedMessages = messages
      .map((msg) => {
        let content: string;
        if (typeof msg.content === "string" && msg.content.length > 0) {
          content = msg.content;
        } else if (Array.isArray(msg.parts) && msg.parts.length > 0) {
          // Extract text from parts - each part is validated to have text or content
          content = msg.parts
            .map((part) => {
              // Both text and content are validated to exist and be non-empty by schema
              return (part.text || part.content || "").trim();
            })
            .filter((text) => text.length > 0)
            .join(" ");
        } else {
          // Fallback - should not happen due to validation, but handle gracefully
          content = "";
        }

        return {
          role: msg.role,
          content,
        };
      })
      .filter((msg) => msg.content.length > 0); // Filter out messages with empty content

    // Ensure we have at least one message with content
    if (transformedMessages.length === 0) {
      return ApiResponse.badRequest(
        "All messages must have valid content. No messages with extractable content found."
      );
    }

    // Create stream result - this doesn't start streaming yet
    const result = streamText({
      model: togetherai("deepseek-ai/DeepSeek-V3.1"),
      system: getSystemPrompt(context, messageContent),
      messages: transformedMessages,
      experimental_transform: smoothStream({
        delayInMs: 20, // optional: defaults to 10ms
        chunking: "word", // optional: defaults to 'word'
      }),

      onFinish: async (responseText) => {
        // Save assistant message with retry logic
        try {
          await withRetry(
            () => createMessage(chatId, responseText.text, "system"),
            3,
            100
          );
        } catch (error) {
          logger.error(
            "Failed to save assistant message after retries",
            error,
            {
              chatId,
              messageLength: responseText.text.length,
            }
          );
          // Don't throw - message is already streamed to user
        }
      },
    });

    // Save user message right before starting the stream
    // This happens after all validation and right before streaming begins
    // If streaming fails, the error will be caught in the outer try-catch
    try {
      await createMessage(chatId, messageContent, "user");
    } catch (error) {
      logger.error("Failed to save user message before stream", error, {
        chatId,
      });
      // Continue anyway - the stream can still proceed
      // The user message will be visible in the UI from the request
    }

    // Return the stream response - this actually starts the streaming
    return result.toUIMessageStreamResponse();
  } catch (error) {
    logger.error("Error processing chat request", error);

    // Handle known error types
    if (error instanceof AuthorizationError) {
      return ApiResponse.error(error.message, error.statusCode);
    }
    if (error instanceof NotFoundError) {
      return ApiResponse.notFound(error.message);
    }
    if (error instanceof ValidationError) {
      return ApiResponse.badRequest(error.message, error.details);
    }

    // Generic error response
    return ApiResponse.error("Error processing chat request", 500, {
      error: error instanceof Error ? error.message : "Unknown error",
      details: error instanceof Error ? error.stack : undefined,
      statusCode: 500,
    });
  }
}
