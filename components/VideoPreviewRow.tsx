import styled from "styled-components";
import type { VideoLike } from "../lib/types";
import type { CommonStyle } from "../lib/types/CommonStyle";
import { SmallVideoPreview } from "./VideoPreview";
import BarLoader from "./common/BarLoader";

const Section = styled.section<CommonStyle>`
  margin: 20px auto;
  padding: ${(props) => props.padding};
  margin: ${(props) => props.margin};
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

  @media screen and (min-width: 768px) {
    margin: 0;
    flex-direction: row;
    align-items: flex-start;
  }
`;

type VideoPreviewRowProps<TVideo extends VideoLike> = {
  id: string;
  videos: TVideo[];
  loading?: boolean;
  commonStyle?: CommonStyle;
  flexWrap?: boolean;
};

function VideoPreviewRow<T extends VideoLike>({
  id,
  videos,
  commonStyle,
  flexWrap,
  loading,
}: VideoPreviewRowProps<T>) {
  return (
    <Section id={id} {...commonStyle}>
      {loading === true && (
        <div style={{ margin: "auto" }}>
          <BarLoader />
        </div>
      )}
      {videos.length === 0 && !loading && <div>No Videos Found</div>}
      <Row flexWrap={flexWrap}>
        {videos.map((video) => (
          <SmallVideoPreview
            key={video.id}
            id={video.id}
            channel={video.channel?.name ?? "No Channel"}
            channelId={video.channel?.id}
            thumbnail_url={video.thumbnail_url ?? ""}
            title={video.name}
            pinned={video.pinned ?? false}
            playlists={video.videoPlaylist}
          />
        ))}
      </Row>
    </Section>
  );
}

export default VideoPreviewRow;
