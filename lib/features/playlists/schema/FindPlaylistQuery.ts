import { z } from "zod";

const orderSchema = z.enum(["asc", "desc"]).optional();

const findPlaylistSchema = z.object({
  cursor: z.string().nullish(),
  size: z
    .number()
    .int()
    .or(z.string().transform((val) => parseInt(val)))
    .optional(),
  orderBy: z
    .object({
      createdAt: orderSchema,
      name: orderSchema,
    })
    .optional(),
});

export default findPlaylistSchema;
