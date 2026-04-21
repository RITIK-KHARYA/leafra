import { describe, it, expect } from "vitest";
import { z } from "zod";

// Mirrored from app/api/chat/route.ts - kept in sync by hand.
const messagePartSchema = z
  .object({
    type: z.string(),
    text: z.string().optional(),
    content: z.string().optional(),
  })
  .refine(
    (d) =>
      (typeof d.text === "string" && d.text.length > 0) ||
      (typeof d.content === "string" && d.content.length > 0),
  );

const messageSchema = z
  .object({
    role: z.enum(["user", "assistant", "system"]),
    content: z.string().optional(),
    parts: z.array(messagePartSchema).optional(),
    id: z.string().optional(),
  })
  .refine((d) => {
    if (typeof d.content === "string" && d.content.length > 0) return true;
    if (Array.isArray(d.parts) && d.parts.length > 0) {
      return d.parts.some(
        (p) =>
          (typeof p.text === "string" && p.text.length > 0) ||
          (typeof p.content === "string" && p.content.length > 0),
      );
    }
    return false;
  });

const chatRequestSchema = z.object({
  messages: z.array(messageSchema).min(1),
  chatId: z.string().uuid(),
});

const UUID = "11111111-2222-3333-4444-555555555555";

describe("chatRequestSchema", () => {
  it("accepts classic content-string messages", () => {
    expect(
      chatRequestSchema.safeParse({
        chatId: UUID,
        messages: [{ role: "user", content: "hi" }],
      }).success,
    ).toBe(true);
  });

  it("accepts parts-array messages (v5 shape)", () => {
    expect(
      chatRequestSchema.safeParse({
        chatId: UUID,
        messages: [
          { role: "user", parts: [{ type: "text", text: "hi" }] },
        ],
      }).success,
    ).toBe(true);
  });

  it("rejects empty content AND empty parts", () => {
    expect(
      chatRequestSchema.safeParse({
        chatId: UUID,
        messages: [{ role: "user", content: "", parts: [] }],
      }).success,
    ).toBe(false);
  });

  it("rejects parts whose only elements are blank text/content", () => {
    expect(
      chatRequestSchema.safeParse({
        chatId: UUID,
        messages: [
          { role: "user", parts: [{ type: "text", text: "" }] },
        ],
      }).success,
    ).toBe(false);
  });

  it("rejects invalid chatId", () => {
    expect(
      chatRequestSchema.safeParse({
        chatId: "not-a-uuid",
        messages: [{ role: "user", content: "hi" }],
      }).success,
    ).toBe(false);
  });

  it("rejects zero-message arrays", () => {
    expect(
      chatRequestSchema.safeParse({ chatId: UUID, messages: [] }).success,
    ).toBe(false);
  });

  it("accepts mixed user/assistant roles in history", () => {
    expect(
      chatRequestSchema.safeParse({
        chatId: UUID,
        messages: [
          { role: "user", content: "a" },
          { role: "assistant", content: "b" },
          { role: "user", content: "c" },
        ],
      }).success,
    ).toBe(true);
  });
});

// Content-extraction logic (mirrors the transform inside route.ts)
function extract(msg: {
  content?: string;
  parts?: Array<{ text?: string; content?: string }>;
}): string {
  if (typeof msg.content === "string" && msg.content.length > 0) return msg.content;
  if (Array.isArray(msg.parts) && msg.parts.length > 0) {
    return msg.parts
      .map((p) => (p.text || p.content || "").trim())
      .filter((t) => t.length > 0)
      .join(" ");
  }
  return "";
}

describe("message content extraction", () => {
  it("prefers content when both are set", () => {
    expect(extract({ content: "A", parts: [{ text: "B" }] })).toBe("A");
  });
  it("joins multi-part text with a single space", () => {
    expect(
      extract({ parts: [{ text: "one" }, { text: "two" }, { content: "three" }] }),
    ).toBe("one two three");
  });
  it("skips parts with only whitespace", () => {
    expect(extract({ parts: [{ text: "   " }, { text: "ok" }] })).toBe("ok");
  });
  it("returns empty string when nothing extractable", () => {
    expect(extract({ parts: [{}] })).toBe("");
  });
});

// Role remap (DB "system" is how the repo stores assistant replies; SDK needs "assistant").
function dbRoleToSdk(role: "user" | "system" | "assistant"): "user" | "assistant" {
  return role === "user" ? "user" : "assistant";
}

describe("DB→SDK role mapping", () => {
  it("keeps user as user", () => {
    expect(dbRoleToSdk("user")).toBe("user");
  });
  it("maps DB 'system' (assistant) to 'assistant'", () => {
    expect(dbRoleToSdk("system")).toBe("assistant");
  });
  it("passes 'assistant' through unchanged", () => {
    expect(dbRoleToSdk("assistant")).toBe("assistant");
  });
});
