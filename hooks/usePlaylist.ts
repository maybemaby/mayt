import { useState } from "react";

interface UsePlaylistParams {
  length: number;
}

export const usePlaylist = ({ length }: UsePlaylistParams) => {
  const [current, setCurrent] = useState(0);

  const next = () => {
    if (current >= length - 1) {
      setCurrent(0);
    } else {
      setCurrent(current + 1);
    }
  };

  const prev = () => {
    if (current <= 0) {
      return;
    } else {
      setCurrent(current - 1);
    }
  };

  const select = (index: number) => {
    if (index >= 0 && index <= length - 1) {
      setCurrent(index);
    }
  };

  return {
    current,
    next,
    prev,
    select,
  };
};
