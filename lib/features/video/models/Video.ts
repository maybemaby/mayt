import { z } from "zod";
import { postChannelSchema } from "./Channel";

export const postVideoSchema = z.object({
  name: z.string(),
  ytId: z.string(),
  length: z.number().int().optional(),
  pinned: z.boolean().default(false),
  channelId: z.string().optional(),
  thumbnailUrl: z.string().optional(),
  thumbnailHeight: z.number().int().optional(),
  thumbnailWidth: z.number().int().optional(),
  channel: postChannelSchema,
});

export type PostVideoDto = z.infer<typeof postVideoSchema>;

export type GetVideoDto = {
  id: string;
  name: string;
  ytId: string;
  length?: number;
  pinned: boolean;
  channelId?: string;
  thumbnailUrl?: string;
  thumbnailHeight?: string;
  thumbnailWidth?: string;
};
