import styled from "styled-components";
import type { CommonStyle } from "../lib/types/CommonStyle";
import { SmallVideoPreview } from "./VideoPreview";

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

const Row = styled.div<{ wrap?: boolean }>`
  margin: auto;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  width: fit-content;
  max-width: 100%;
  gap: 20px;
  overflow-x: auto;
  flex-wrap: ${(props) => (props.wrap ? "wrap" : "nowrap")};

  @media screen and (min-width: 768px) {
    margin: 0px;
    flex-direction: row;
    align-items: flex-start;
  }
`;

interface VideoLike {
  id: string;
  name: string;
  channel: {
    id: string;
    name: string;
  } | null;
  thumbnail_url: string | null;
}

type VideoPreviewRowProps<TVideo extends VideoLike> = {
  id: string;
  videos: TVideo[];
  commonStyle?: CommonStyle;
  flexWrap?: boolean;
};

function VideoPreviewRow<T extends VideoLike>({
  id,
  videos,
  commonStyle,
  wrap,
}: VideoPreviewRowProps<T>) {
  return (
    <Section id={id} {...commonStyle}>
      {videos.length === 0 && <div>No Videos Found</div>}
      <Row wrap={wrap}>
        {videos.map((video) => (
          <SmallVideoPreview
            key={video.id}
            channel={video.channel?.name ?? "No Channel"}
            channelId={video.channel?.id}
            thumbnail_url={video.thumbnail_url ?? ""}
            title={video.name}
          />
        ))}
      </Row>
    </Section>
  );
}

export default VideoPreviewRow;
