import { z } from "zod";

const orderSchema = z.enum(["asc", "desc"]);
const orderProps = z.enum(["name", "addedAt"]);

export const getQuerySchema = z.object({
  cursor: z.string().nullish(),
  // If a string is passed to size, it will transform to an integer
  size: z
    .number()
    .int()
    .or(z.string().transform((val) => parseInt(val)))
    .optional(),
  channelId: z.string().optional(),
  playlistId: z.string().optional(),
  tags: z
    .string()
    .array()
    .max(10, "Maximum 10 tags can be used")
    .or(z.string().transform((val) => [val]))
    .optional(),
  orderBy: z
    .object({
      prop: orderProps,
      direction: orderSchema,
    })
    .optional(),
  query: z.string().min(1).optional(),
});
