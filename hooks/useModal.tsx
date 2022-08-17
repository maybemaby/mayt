import { useCallback, useContext } from "react";
import { ModalContext } from "../components/ModalProvider";

export const useModal = () => {
  const modalState = useContext(ModalContext);

  const open = () => {
    if (modalState.setOpen !== null) {
      modalState.setOpen(true);
    }
  };

  const close = useCallback(() => {
    if (modalState.setOpen !== null) {
      modalState.setOpen(false);
    }
    if (modalState.videoPlaylist.setVideoId) {
      modalState.videoPlaylist.setVideoId(null);
    }
    if (modalState.videoPlaylist.setIncludedPlaylists) {
      modalState.videoPlaylist.setIncludedPlaylists([]);
    }
  }, []);

  return {
    openState: modalState.open,
    open,
    close,
    videoPlaylist: modalState.videoPlaylist,
  };
};
