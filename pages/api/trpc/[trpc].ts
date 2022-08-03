import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { videoRouter } from "../../../lib/features/video/videoRouter";
import { channelRouter } from "../../../lib/features/channels/channelRouter";

export const appRouter = trpc
  .router()
  .merge("videos.", videoRouter)
  .merge("channels.", channelRouter);

export type AppRouter = typeof appRouter;

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => null,
});
