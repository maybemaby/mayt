import { z } from "zod";

export const postPlaylistSchema = z.object({
  name: z.string().max(200),
});

export type PostPlaylistDto = z.infer<typeof postPlaylistSchema>;
