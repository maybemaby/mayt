import { trpc } from "@lib/utils/trpc";
import toast from "react-hot-toast";

export const useVideoPreview = (channelId?: string) => {
  const utils = trpc.useContext();

  const clear = trpc.useMutation("videos.delete", {
    onSuccess(input) {
      toast.success("Deleted!");
      utils.invalidateQueries(["videos.find"]);
      utils.invalidateQueries(["videos.getPinned"]);
      utils.invalidateQueries(["videos.find", { channelId }]);
    },
  });

  const togglePin = trpc.useMutation("videos.togglePinned", {
    onSuccess(input) {
      input.pinned
        ? toast.success(`Pinned ${input.name}`)
        : toast.success(`Unpinned ${input.name}`);

      utils.invalidateQueries(["videos.find"]);
      utils.invalidateQueries(["videos.getPinned"]);
    },
    onError(e) {
      toast.error(`Couldn't pin/unpin`);
    },
  });

  return { clear, togglePin };
};
