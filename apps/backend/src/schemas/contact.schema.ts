import { z } from "zod";

export const ContactSchema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  organization: z.string().nullable().optional(),
  position: z.string().nullable().optional(),
  avatar_url: z.string().url().nullable().optional(),
});

export type ContactInput = z.infer<typeof ContactSchema>;
