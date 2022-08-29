import { useCallback, useContext } from "react";
import { ModalContext } from "../components/ModalProvider";

export const useModal = () => {
  const modalState = useContext(ModalContext);

  const open = () => {
    if (modalState.setOpen !== null) {
      document.body.style.overflow = "hidden";
      modalState.setOpen(true);
    }
  };

  const close = useCallback(() => {
    if (modalState.setOpen !== null) {
      modalState.setOpen(false);
      document.body.style.overflow = "scroll";
    }
    if (modalState.videoPlaylist.setVideoId) {
      modalState.videoPlaylist.setVideoId(null);
    }
    if (modalState.videoPlaylist.setIncludedPlaylists) {
      modalState.videoPlaylist.setIncludedPlaylists([]);
    }
    if (modalState.tagModal.setVideoId) {
      modalState.tagModal.setVideoId(null);
    }
    if (modalState.tagModal.setVideoTags) {
      modalState.tagModal.setVideoTags([]);
    }
  }, []);

  return {
    openState: modalState.open,
    open,
    close,
    videoPlaylist: modalState.videoPlaylist,
    tagModal: modalState.tagModal,
  };
};
