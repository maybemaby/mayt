import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { videoRouter } from "../../../lib/features/video/videoRouter";
import { channelRouter } from "../../../lib/features/channels/channelRouter";
import { playlistRouter } from "../../../lib/features/playlists/playlistRouter";

export const appRouter = trpc
  .router()
  .merge("videos.", videoRouter)
  .merge("channels.", channelRouter)
  .merge("playlists.", playlistRouter);

export type AppRouter = typeof appRouter;

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => null,
});
