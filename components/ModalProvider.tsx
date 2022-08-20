import React, { createContext, useState } from "react";

type ModalProviderProps = {
  children: React.ReactNode;
};

type PlaylistLike = {
  videoId: string;
  playlistId: string;
};

type ModalStore = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>> | null;
  videoPlaylist: {
    videoId: string | null;
    setVideoId: React.Dispatch<React.SetStateAction<string | null>> | null;
    includedPlaylists: PlaylistLike[] | null;
    setIncludedPlaylists: React.Dispatch<PlaylistLike[] | null> | null;
  };
};

export const ModalContext = createContext<ModalStore>({
  open: false,
  setOpen: null,
  videoPlaylist: {
    videoId: null,
    setVideoId: null,
    includedPlaylists: null,
    setIncludedPlaylists: null,
  },
});

const ModalProvider = ({ children }: ModalProviderProps) => {
  const [open, setOpen] = useState(false);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [includedPlaylists, setIncludedPlaylists] = useState<
    PlaylistLike[] | null
  >(null);

  return (
    <ModalContext.Provider
      value={{
        open,
        setOpen,
        videoPlaylist: {
          videoId,
          setVideoId,
          includedPlaylists,
          setIncludedPlaylists,
        },
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export default ModalProvider;
