import { trpc } from "@lib/utils/trpc";

export const useFindVideoLazy = (videoId?: string) => {
  const video = trpc.useQuery(["videos.getOne", videoId ?? ""], {
    enabled: !!videoId,
  });

  return {
    video,
  };
};
