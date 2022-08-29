import { useContext, useMemo } from "react";
import { PlayerContext, Watchable } from "../components/PlayerProvider";

export const usePlayer = () => {
  const { watching, setWatching, currentIndex, setCurrentIndex } =
    useContext(PlayerContext);

  const current = useMemo(() => {
    return watching[currentIndex] ?? "No Video";
  }, [watching, currentIndex]);

  const next = () => {
    if (currentIndex >= watching.length - 1) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prev = () => {
    if (currentIndex <= 0) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const moveTo = (id: string) => {
    const index = watching.findIndex((value) => value.id === id);
    if (index >= 0) {
      setCurrentIndex(index);
    }
  };

  // Helper for extending list state to prevent code duplication
  const extendVideos = (mode: "prepend" | "append", videos: Watchable[]) => {
    let updated: Watchable[];
    if (mode === "append") {
      updated = [...watching, ...videos];
    } else {
      updated = [...videos, ...watching];
    }
    if (watching.length === 0) {
      setCurrentIndex(0);
      setWatching(updated);
      return;
    }
    const newIndex = updated.findIndex(
      (video) => video.id == watching[currentIndex].id
    );
    if (newIndex >= 0) {
      setCurrentIndex(newIndex);
    } else {
      setCurrentIndex(0);
    }
    setWatching(updated);
  };

  const appendVideos = (videos: Watchable[]) => {
    extendVideos("append", videos);
  };

  const prependVideos = (videos: Watchable[]) => {
    extendVideos("prepend", videos);
  };

  const clearVideos = () => {
    setWatching([]);
  };

  return {
    current,
    watchList: watching,
    next,
    prev,
    moveTo,
    appendVideos,
    prependVideos,
    clearVideos,
  };
};
