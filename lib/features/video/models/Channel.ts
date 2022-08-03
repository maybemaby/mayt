import { z } from "zod";

export const postChannelSchema = z.object({
  name: z.string(),
  url: z.string().url(),
});

export type PostChannelDto = z.infer<typeof postChannelSchema>;
