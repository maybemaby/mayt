import * as trpc from "@trpc/server";
import { z } from "zod";
import TagService from "./TagService";
import { handleRouterError } from "../../utils/errorHandlers";

export const tagRouter = trpc
  .router()
  .mutation("create", {
    input: z.object({
      name: z.string().min(1),
      typeId: z.string().min(1).optional(),
    }),
    async resolve({ input }) {
      return await TagService.createTag(input.name, input.typeId);
    },
  })
  .mutation("delete", {
    input: z.string().min(1),
    async resolve({ input }) {
      try {
        return await TagService.deleteTag(input);
      } catch (e) {
        throw handleRouterError(e);
      }
    },
  })
  .query("find", {
    input: z.object({
      videoId: z.string().min(1).optional(),
    }),
    async resolve({ input }) {
      return await TagService.findTags({ videoId: input.videoId });
    },
  });
