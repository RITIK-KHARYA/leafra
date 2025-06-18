import { z } from "zod";

export const newchatschema = z.object({
  chatName: z.string().min(1, "Chat name is required"),
  description: z.string().min(1, "Description is required"),
  priority: z.string().min(1, "Priority is required"),
  workSection: z.string().min(1, "Work Section is required"),
});
