import { trpc } from "@lib/utils/trpc";

export const useFrontpageFetch = () => {
  const latest = trpc.useQuery(["videos.find", { size: 20 }], {
    staleTime: 60,
  });

  const pinned = trpc.useQuery(["videos.getPinned", {}], {
    staleTime: 60,
  });

  return { latest, pinned };
};
