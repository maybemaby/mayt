import { z } from "zod";

export const getQuerySchema = z.object({
  last: z.string().optional(),
  // If a string is passed to size, it will transform to an integer
  size: z
    .number()
    .int()
    .or(z.string().transform((val) => parseInt(val)))
    .optional(),
  channelId: z.string().optional(),
  tags: z
    .string()
    .array()
    .max(10, "Maximum 10 tags can be used")
    .or(z.string().transform((val) => [val]))
    .optional(),
});
