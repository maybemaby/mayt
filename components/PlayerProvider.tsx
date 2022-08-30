import { createContext, ReactNode, useEffect, useState } from "react";
import type { SmallVideoPreview } from "./VideoPreview";

export type Watchable = Parameters<typeof SmallVideoPreview>[0];

type PlayerStore = {
  watching: Watchable[];
  setWatching(videos: Watchable[]): void;
  currentIndex: number;
  setCurrentIndex(value: number): void;
};

type PlayerProviderProps = {
  children: ReactNode;
};

export const PlayerContext = createContext<PlayerStore>({
  watching: [],
  setWatching(videos: Watchable[]) {
    return;
  },
  currentIndex: 0,
  setCurrentIndex(value: number) {
    return;
  },
});

const PlayerProvider = ({ children }: PlayerProviderProps) => {
  const [watching, setWatching] = useState<Watchable[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem("mayt_player");
    if (saved) {
      setWatching(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("mayt_player", JSON.stringify(watching));
  }, [watching]);

  return (
    <PlayerContext.Provider
      value={{
        watching,
        setWatching,
        currentIndex,
        setCurrentIndex,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export default PlayerProvider;
