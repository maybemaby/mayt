import { Playable } from "@lib/types/Playable";
import { trpc } from "@lib/utils/trpc";
import { useEffect, useState } from "react";
import create from "zustand";

type PlayerActions =
  | {
      action: "next";
    }
  | {
      action: "prev";
    }
  | {
      action: "moveTo";
      videoId: string;
    };

type PlayerStore = {
  nowPlaying: number;
  upNext: Playable[];
  history: Playable[];
  archive: () => void;
  addNext: (next: Playable | Playable[]) => void;
  clearUpNext: () => void;
  addToHistory: (videos: Playable[] | Playable) => void;
  movePlayer: (action: PlayerActions) => void;
};

export const _usePlayerStore = create<PlayerStore>()((set, get) => ({
  nowPlaying: 0,
  upNext: [],
  history: [],
  addNext(next) {
    set((state) => {
      if (!Array.isArray(next)) {
        return {
          ...state,
          upNext: [...state.upNext, next],
        };
      }
      return {
        ...state,
        upNext: [...state.upNext, ...next],
      };
    });
  },
  archive() {
    set((state) => {
      return {
        ...state,
        upNext: [],
        history: [...state.history, ...state.upNext],
      };
    });
  },
  clearUpNext() {
    set(() => {
      return {
        upNext: [],
      };
    });
  },
  addToHistory(videos) {
    if (Array.isArray(videos)) {
      return {
        history: [...get().history, ...videos],
      };
    }
    return {
      history: [...get().history, videos],
    };
  },
  movePlayer(action) {
    set(({ nowPlaying, upNext }) => {
      switch (action.action) {
        case "next":
          if (nowPlaying >= upNext.length - 1) {
            return {
              nowPlaying: 0,
            };
          }
          return {
            nowPlaying: nowPlaying + 1,
          };
        case "prev":
          if (nowPlaying <= 0) {
            return {
              nowPlaying: 0,
            };
          }
          return {
            nowPlaying: nowPlaying - 1,
          };
        case "moveTo":
          const index = upNext.findIndex(
            (video) => video.id === action.videoId
          );
          if (index >= 0) {
            return {
              nowPlaying: index,
            };
          }
          return {
            nowPlaying: nowPlaying,
          };
        default:
          return {
            nowPlaying: nowPlaying,
          };
      }
    });
  },
}));

export const usePlayerStore = () => {
  const store = _usePlayerStore();
  const [playlistId, setPlaylistId] = useState("");
  const playlistVideos = trpc.useQuery(
    ["videos.find", { playlistId: playlistId }],
    {
      enabled: playlistId.length > 0,
    }
  );

  const loadPlaylist = (id: string) => {
    console.log(id);
    setPlaylistId(id);
  };

  useEffect(() => {
    if (playlistVideos.isSuccess) {
      console.log("Adding");
      store.addNext(
        playlistVideos.data.videos.map((video) => ({
          id: video.id,
          name: video.name,
          ytId: video.ytId,
          channel: video.channel?.name ?? "",
          channelId: video.channel?.id ?? "",
        }))
      );
    }
  }, [playlistVideos.isSuccess, playlistVideos.data]);

  return { ...store, loadPlaylist };
};
