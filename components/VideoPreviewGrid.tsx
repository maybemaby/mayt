import { useInView } from "react-intersection-observer";
import { VideoLike } from "../lib/types";
import { SmallVideoPreview } from "./VideoPreview";
import { CommonStyle } from "../lib/types/CommonStyle";
import BarLoader from "./common/BarLoader";
import BaseGrid from "./common/BaseGrid";

type VideoPreviewGridProps<T extends VideoLike> = {
  commonStyle?: CommonStyle;
  videos: T[];
  onLoad(): void;
  loading: boolean;
};

function VideoPreviewGrid<T extends VideoLike>({
  commonStyle,
  videos,
  onLoad,
  loading,
}: VideoPreviewGridProps<T>) {
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
        {videos.map((video, index) => {
          if (index === videos.length - 1) {
            return (
              <SmallVideoPreview
                ref={ref}
                key={video.id}
                id={video.id}
                channel={video.channel?.name ?? "No Channel"}
                pinned={video.pinned ?? false}
                title={video.name}
                thumbnail_url={video.thumbnail_url ?? ""}
                channelId={video.channel?.id}
                playlists={video.videoPlaylist}
              />
            );
          }
          return (
            <SmallVideoPreview
              key={video.id}
              id={video.id}
              channel={video.channel?.name ?? "No Channel"}
              pinned={video.pinned ?? false}
              title={video.name}
              thumbnail_url={video.thumbnail_url ?? ""}
              channelId={video.channel?.id}
              playlists={video.videoPlaylist}
            />
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

export default VideoPreviewGrid;
