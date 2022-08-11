import { z } from "zod";

const updatePlaylistSchema = z.object({
  name: z
    .string()
    .max(50, "Playlists names cannot exceed 50 characters")
    .optional(),
});

export type UpdatePlaylistDto = z.infer<typeof updatePlaylistSchema>;

export default updatePlaylistSchema;
