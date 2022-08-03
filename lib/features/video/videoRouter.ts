import * as trpc from "@trpc/server";
import VideoService from "./VideoService";
import { postVideoSchema } from "./models/Video";
import { getQuerySchema } from "./schema/GetQuery";
import { z } from "zod";

export const videoRouter = trpc
  .router()
  .mutation("create", {
    input: postVideoSchema,
    async resolve({ input }) {
      const video = await VideoService.createVideo(input);
      return video;
    },
  })
  .mutation("delete", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input: { id } }) {
      await VideoService.deleteVideo(id);
      return { id };
    },
  })
  .query("getPinned", {
    input: z.object({
      size: z.number().int().default(20),
    }),
    async resolve({ input: { size } }) {
      return await VideoService.getPinned(size);
    },
  })
  .query("find", {
    input: getQuerySchema,
    async resolve({ input }) {
      const videos = await VideoService.findVideos({
        channelId: input.channelId,
        cursor: input.last,
        size: input.size,
        matchingTags: input.tags,
      });
      return videos;
    },
  })
  .mutation("addTag", {
    input: z.object({
      videoId: z.string(),
      tagId: z.string(),
    }),
    async resolve({ input }) {
      return await VideoService.addTag(input.videoId, input.tagId);
    },
  });
