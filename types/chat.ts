import { z } from "zod";

export const newChatSchema = z.object({
  chatName: z.string().min(1, "Chat name is required"),
  userid: z
    .object({
      id: z.string(),
      email: z.string().email(),
      name: z.string(),
    })
    .optional(),
  description: z.string().min(1, "Description is required"),
  priority: z.string().min(1, "Priority is required"),
  workSection: z.string().min(1, "Work Section is required"),
});

export type NewChatInput = z.infer<typeof newChatSchema>;

