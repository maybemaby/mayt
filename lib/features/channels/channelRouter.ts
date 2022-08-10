import * as trpc from "@trpc/server";
import { z } from "zod";
import ChannelService from "./ChannelService";
import { postChannelSchema } from "../video/models/Channel";
import { handleRouterError } from "../../utils/errorHandlers";

export const channelRouter = trpc
  .router()
  .mutation("createOrUpdate", {
    input: postChannelSchema,
    async resolve({ input }) {
      try {
        return await ChannelService.createOrUpdateChannel(input);
      } catch (err) {
        throw handleRouterError(err);
      }
    },
  })
  .query("byId", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input }) {
      return await ChannelService.findChannel(input.id);
    },
  });
