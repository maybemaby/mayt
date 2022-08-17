import * as trpc from "@trpc/server";
import { z } from "zod";
import PlaylistService from "./PlaylistService";
import { postPlaylistSchema } from "./models/Playlist";
import { handleRouterError } from "../../utils/errorHandlers";
import findPlaylistSchema from "./schema/FindPlaylistQuery";
import updatePlaylistSchema from "./schema/UpdatePlaylistQuery";

export const playlistRouter = trpc
  .router()
  .mutation("create", {
    input: postPlaylistSchema,
    async resolve({ input }) {
      try {
        return await PlaylistService.createPlaylist(input);
      } catch (e) {
        throw handleRouterError(e);
      }
    },
  })
  .mutation("addVideo", {
    input: z.object({
      videoId: z.string().min(1).max(50),
      playlistId: z.string().min(1).max(50),
    }),
    async resolve({ input }) {
      try {
        return await PlaylistService.addVideo(input.videoId, input.playlistId);
      } catch (err) {
        throw handleRouterError(err);
      }
    },
  })
  .mutation("removeVideo", {
    input: z.object({
      videoId: z.string().min(1).max(50),
      playlistId: z.string().min(1).max(50),
    }),
    async resolve({ input }) {
      try {
        return await PlaylistService.removeVideo(
          input.videoId,
          input.playlistId
        );
      } catch (err) {
        throw handleRouterError(err);
      }
    },
  })
  .query("getOne", {
    input: z.string(),
    async resolve({ input }) {
      return await PlaylistService.getOneById(input);
    },
  })
  .query("find", {
    input: findPlaylistSchema,
    async resolve({ input }) {
      const playlists = await PlaylistService.find({
        cursor: input.cursor ?? undefined,
        size: input.size,
        orderBy: input.orderBy,
      });
      if (input.size && playlists.length < input.size) {
        return { playlists, cursor: null };
      } else if (!input.size && playlists.length < 20) {
        return { playlists, cursor: null };
      }
      const cursor = playlists[playlists.length - 1].id;
      return { playlists, cursor };
    },
  })
  .query("getAllVideos", {
    input: z.object({
      playlistId: z.string().max(50),
    }),
    async resolve({ input }) {
      return await PlaylistService.getAllVideos(input.playlistId);
    },
  })
  .mutation("deleteOne", {
    input: z.string(),
    async resolve({ input }) {
      try {
        return await PlaylistService.deleteOne(input);
      } catch (err) {
        throw handleRouterError(err);
      }
    },
  })
  .mutation("update", {
    input: z.object({
      id: z.string(),
      dto: updatePlaylistSchema,
    }),
    async resolve({ input }) {
      try {
        return await PlaylistService.update(input.id, input.dto);
      } catch (err) {
        throw handleRouterError(err);
      }
    },
  });
