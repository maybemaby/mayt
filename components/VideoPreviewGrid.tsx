import styled from "styled-components";
import { VideoLike } from "../lib/types";
import { SmallVideoPreview } from "./VideoPreview";
import { CommonStyle } from "../lib/types/CommonStyle";

type VideoPreviewGridProps<T extends VideoLike> = {
  commonStyle?: CommonStyle;
  videos: T[];
};

const GridContainer = styled.div<CommonStyle>`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  grid-row-gap: 20px;
  grid-column-gap: 5px;
  justify-content: center;
  justify-items: center;
  width: ${(props) => props.width ?? "100%"};
  padding: ${(props) => props.padding};
  margin: ${(props) => props.margin};

  @media screen and (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media screen and (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media screen and (min-width: 1280px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media screen and (min-width: 1440px) {
    grid-template-columns: repeat(5, 1fr);
  }
`;

function VideoPreviewGrid<T extends VideoLike>({
  commonStyle,
  videos,
}: VideoPreviewGridProps<T>) {
  return (
    <GridContainer {...commonStyle}>
      {videos.map((video) => {
        return (
          <SmallVideoPreview
            key={video.id}
            id={video.id}
            channel={video.channel?.name ?? "No Channel"}
            pinned={video.pinned ?? false}
            title={video.name}
            thumbnail_url={video.thumbnail_url ?? ""}
            channelId={video.channel?.id}
          />
        );
      })}
    </GridContainer>
  );
}

export default VideoPreviewGrid;
