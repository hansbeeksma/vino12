import { z } from "zod";

export const ideaInputSchema = z.object({
  message: z
    .string()
    .min(3, "Idee moet minimaal 3 tekens bevatten")
    .max(5000, "Idee mag maximaal 5000 tekens bevatten"),
  source: z.enum(["web", "voice"]).default("web"),
  tags: z.array(z.string().max(50)).max(10).optional(),
});

export type IdeaInput = z.infer<typeof ideaInputSchema>;
