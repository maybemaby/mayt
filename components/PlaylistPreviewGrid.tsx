import { useInView } from "react-intersection-observer";
import type { PlaylistLike } from "@lib/types";
import type { CommonStyle } from "@lib/types/CommonStyle";

import PlaylistPreview from "./PlaylistPreview";
import BaseGrid from "./common/BaseGrid";
import BarLoader from "./common/BarLoader";

type PlaylistPreviewGridProps<T extends PlaylistLike> = {
  commonStyle?: CommonStyle;
  playlists: T[];
  onLoad(): void;
  loading: boolean;
};

function PlaylistPreviewGrid<T extends PlaylistLike>({
  commonStyle,
  playlists,
  onLoad,
  loading,
}: PlaylistPreviewGridProps<T>) {
  const { ref } = useInView({
    threshold: 1.0,
    trackVisibility: true,
    delay: 1000,
    onChange: (inView) => {
      if (inView && !loading) {
        onLoad();
      }
    },
  });

  return (
    <>
      <BaseGrid {...commonStyle}>
        {playlists.map((playlist, index) => {
          if (index === playlists.length - 1) {
            return (
              <PlaylistPreview
                ref={ref}
                key={playlist.id}
                playlist={playlist}
              />
            );
          }
          return (
            <PlaylistPreview ref={ref} key={playlist.id} playlist={playlist} />
          );
        })}
      </BaseGrid>
      {loading && (
        <div style={{ margin: " 20px auto" }}>
          <BarLoader />
        </div>
      )}
    </>
  );
}

export default PlaylistPreviewGrid;
