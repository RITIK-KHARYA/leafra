import { z } from "zod";
import { _email } from "zod/v4/core";

export const newchatschema = z.object({
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
