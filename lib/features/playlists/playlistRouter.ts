import * as trpc from "@trpc/server";
import { z } from "zod";
import PlaylistService from "./PlaylistService";
import { postPlaylistSchema } from "./models/Playlist";
import { handleRouterError } from "../../utils/errorHandlers";

export const playlistRouter = trpc
  .router()
  .mutation("create", {
    input: postPlaylistSchema,
    async resolve({ input }) {
      try {
        const playlist = await PlaylistService.createPlaylist(input);
        return playlist;
      } catch (e) {
        throw handleRouterError(e);
      }
    },
  })
  .query("getOne", {
    input: z.string(),
    async resolve({ input }) {
      return await PlaylistService.getOneById(input);
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
  });
