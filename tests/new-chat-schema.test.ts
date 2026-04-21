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

  it("trims are NOT automatic (caller must trim before submit)", () => {
    // This test documents current behaviour - updating it requires a schema change.
    const res = newChatSchema.safeParse({ ...valid, chatName: "   " });
    expect(res.success).toBe(true);
  });
});
