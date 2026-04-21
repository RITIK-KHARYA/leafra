import { describe, it, expect } from "vitest";
import { newChatSchema } from "@/types/chat";

describe("newChatSchema (create-chat form)", () => {
  const valid = {
    chatName: "Research PDF",
    description: "Quarterly review",
    priority: "high",
    workSection: "student",
  };

  it("accepts a valid payload", () => {
    expect(newChatSchema.safeParse(valid).success).toBe(true);
  });

  it.each(["chatName", "description", "priority", "workSection"] as const)(
    "rejects empty %s",
    (field) => {
      const res = newChatSchema.safeParse({ ...valid, [field]: "" });
      expect(res.success).toBe(false);
    },
  );

  it("trims whitespace around free-text fields", () => {
    const res = newChatSchema.safeParse({
      ...valid,
      chatName: "  Research PDF  ",
    });
    expect(res.success).toBe(true);
    if (res.success) expect(res.data.chatName).toBe("Research PDF");
  });

  it("rejects whitespace-only free-text (post-sanitization empty)", () => {
    // zSanitizedText trims + NFKC + strips invisibles. A whitespace-only
    // chatName becomes "" after sanitization and must fail the refine.
    const res = newChatSchema.safeParse({ ...valid, chatName: "   " });
    expect(res.success).toBe(false);
  });

  it("strips zero-width / bidi-override characters (homograph defence)", () => {
    const res = newChatSchema.safeParse({
      ...valid,
      chatName: "ev\u202Eil\u202Dname",
    });
    expect(res.success).toBe(true);
    if (res.success) expect(res.data.chatName).toBe("evilname");
  });
});
