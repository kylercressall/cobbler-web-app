import { z } from "zod";

export const NodePositionSchema = z.object({
  id: z.string().uuid(),
  x: z.number(),
  y: z.number(),
});

export type NodePosition = z.infer<typeof NodePositionSchema>;

export const EdgeSchema = z.object({
  id: z.string().uuid(),
  source: z.string().uuid(),
  target: z.string().uuid(),
  label: z.string().optional(),
  type: z.string().optional(), // reactflow type
});

export type Edge = z.infer<typeof EdgeSchema>;
