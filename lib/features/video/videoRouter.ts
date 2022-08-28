import * as trpc from "@trpc/server";
import { z } from "zod";
import VideoService from "./VideoService";
import { postVideoSchema } from "./models/Video";
import { getQuerySchema } from "./schema/GetQuery";
import { handleRouterError } from "../../utils/errorHandlers";

export const videoRouter = trpc
  .router()
  .mutation("create", {
    input: postVideoSchema,
    async resolve({ input }) {
      try {
        return await VideoService.createVideo(input);
      } catch (err) {
        throw handleRouterError(err);
      }
    },
  })
  .mutation("delete", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input: { id } }) {
      try {
        await VideoService.deleteVideo(id);
        return { id };
      } catch (err) {
        throw handleRouterError(err);
      }
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
        cursor: input.cursor ?? undefined,
        size: input.size,
        matchingTags: input.tags,
        orderBy: input.orderBy ? { ...input.orderBy } : undefined,
        query: input.query,
      });
      if (input.size && videos.length < input.size) {
        return { videos, cursor: null };
      } else if (!input.size && videos.length < 20) {
        return { videos, cursor: null };
      }
      const cursor = videos[videos.length - 1].id;
      return { videos, cursor };
    },
  })
  .query("getOne", {
    input: z.string().min(1).max(50),
    async resolve({ input }) {
      return await VideoService.getOne(input);
    },
  })
  .query("search", {
    input: z.object({
      q: z.string().min(1),
    }),
    async resolve({ input }) {
      return await VideoService.searchVideos(input.q);
    },
  })
  .mutation("addTag", {
    input: z.object({
      videoId: z.string(),
      tagId: z.string(),
    }),
    async resolve({ input }) {
      try {
        return await VideoService.addTag(input.videoId, input.tagId);
      } catch (e) {
        throw handleRouterError(e);
      }
    },
  })
  .mutation("removeTag", {
    input: z.object({
      videoId: z.string(),
      tagId: z.string(),
    }),
    async resolve({ input }) {
      try {
        return await VideoService.removeTag(input.videoId, input.tagId);
      } catch (e) {
        throw handleRouterError(e);
      }
    },
  })
  .mutation("togglePinned", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input }) {
      return await VideoService.togglePinned(input.id);
    },
  });
