import { array, number, object, string } from "yup";

export const getQuerySchema = object({
  last: string().optional(),
  size: number().optional(),
  channelId: string().optional(),
  tag: array()
    .of(string())
    .max(10, "Maximum 10 tags can be used")
    .optional()
    .ensure()
    .default(undefined),

  // .transform((value: string | string[]) => {
  //   return typeof value === "string" ? [value] : value;
  // }),
});
