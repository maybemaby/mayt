import { InferType, object, string } from "yup";

export const postChannelSchema = object({
  name: string().required(),
  url: string().required().url(),
});

export type PostChannelDto = InferType<typeof postChannelSchema>;
