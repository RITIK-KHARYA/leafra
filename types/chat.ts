import { z } from "zod";
import { zSanitizedText } from "@/lib/security/sanitize";

// Enums for fixed-choice fields (defense-in-depth against arbitrary strings).
export const PRIORITIES = [
  "high",
  "medium",
  "low",
  "premium",
  "important",
] as const;

export const WORK_SECTIONS = [
  "student",
  "office",
  "remote",
  "freelancer",
  "team-lead",
  "developer",
  "designer",
  "marketing",
  "sales",
  "support",
  "personal",
  "other",
] as const;

export const newChatSchema = z.object({
  chatName: zSanitizedText({ maxLen: 120 }),
  description: zSanitizedText({ maxLen: 2_000 }),
  priority: z.enum(PRIORITIES, {
    errorMap: () => ({ message: "Priority is required" }),
  }),
  workSection: z.enum(WORK_SECTIONS, {
    errorMap: () => ({ message: "Work Section is required" }),
  }),
});

export type NewChatInput = z.infer<typeof newChatSchema>;
