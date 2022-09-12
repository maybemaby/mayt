import styled from "styled-components";
import type { VideoFindReturn } from "@lib/types";
import type { CommonStyle } from "@lib/types/CommonStyle";
import { SmallVideoPreview } from "./VideoPreview";
import BarLoader from "./common/BarLoader";
import { Unpacked } from "@lib/types/Unpacked";
import { useRef } from "react";

const Section = styled.section<CommonStyle>`
  padding: ${(props) => props.padding};
  margin: ${(props) => props.margin ?? "20px auto"};
  border-radius: ${(props) => props.borderRadius};
  width: 80%;

  @media screen and (min-width: 768px) {
    margin: 20px 80px;
    width: ${(props) => props.width ?? "90%"};
    max-width: 100%;
  }
`;

const Row = styled.div<{ flexWrap?: boolean }>`
  margin: auto;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  width: fit-content;
  max-width: 100%;
  gap: 20px;
  overflow-x: auto;
  flex-wrap: ${(props) => (props.flexWrap ? "wrap" : "nowrap")};
  padding-bottom: 10px;

  @media screen and (min-width: 768px) {
    margin: 0;
    flex-direction: row;
    align-items: flex-start;
  }
`;

type VideoPreviewRowProps<TVideo extends Unpacked<VideoFindReturn["videos"]>> =
  {
    id: string;
    videos: TVideo[];
    loading?: boolean;
    commonStyle?: CommonStyle;
    flexWrap?: boolean;
    prioritize?: number[];
  };

// prioritize is a list of indexes to prioritize image loads for.
function VideoPreviewRow<T extends Unpacked<VideoFindReturn["videos"]>>({
  id,
  videos,
  commonStyle,
  flexWrap,
  loading,
  prioritize = [],
}: VideoPreviewRowProps<T>) {
  const rowRef = useRef<HTMLDivElement | null>(null);

  const getRow = () => {
    return rowRef;
  };
  return (
    <Section id={id} {...commonStyle}>
      {loading === true && (
        <div style={{ margin: "auto" }}>
          <BarLoader />
        </div>
      )}
      {videos.length === 0 && !loading && <div>No Videos Found</div>}
      <Row ref={rowRef} flexWrap={flexWrap}>
        {videos.map((video, index) => (
          <SmallVideoPreview
            key={video.id}
            id={video.id}
            ytId={video.ytId}
            channel={video.channel?.name ?? "No Channel"}
            channelId={video.channel?.id}
            thumbnail_url={video.thumbnail_url ?? ""}
            name={video.name}
            pinned={video.pinned ?? false}
            playlists={video.videoPlaylist}
            tags={video.VideoTag}
            getContainerRef={getRow}
            prioritize={index in prioritize}
          />
        ))}
      </Row>
    </Section>
  );
}

export default VideoPreviewRow;
