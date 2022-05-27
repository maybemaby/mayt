import { boolean, InferType, number, object, string } from "yup";
import { postChannelSchema } from "./Channel";

const postVideoSchema = object({
  name: string().required(),
  ytId: string().required(),
  length: number().optional().default(undefined),
  pinned: boolean().optional().default(false),
  channelId: string().optional().default(undefined),
  thumbnailUrl: string().optional().default(undefined),
  thumbnailHeight: number().optional().default(undefined),
  thumbnailWidth: number().optional().default(undefined),
  channel: postChannelSchema,
});

export type PostVideoDto = InferType<typeof postVideoSchema>;
