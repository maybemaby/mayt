import React, { ForwardedRef, RefObject, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import styled from "styled-components";
import BaseRow from "./common/BaseRow";
import { usePlayerStore } from "stores/PlayerStore";
import { useVideoPreview } from "@hooks/useVideoPreview";
import { useModalStore } from "@stores/ModalStore";
import AddVideoToPlaylist from "@components/AddVideoToPlaylist";
import UpdateTagsModal from "@components/UpdateTagsModal";

const DynamicMenu = dynamic(() => import("../components/Menu"), {
  ssr: false,
  loading: () => <div></div>,
});

type VideoPreviewProps = {
  thumbnail_url: string | null;
  name: string;
  channel: string;
  channelId?: string;
};

const StyledImage = styled(Image)`
  border-radius: 10px;
`;

const ImageContainer = styled.div`
  box-shadow: 3px 4px 3px rgba(0, 0, 0, 0.427);
  position: relative;
  margin-bottom: 20px;
  border-radius: 10px;
  width: 90%;
  aspect-ratio: 4/3;

  @media screen and (min-width: 512px) {
    width: 480px;
    height: 360px;
  }
`;

const SmallImageContainer = styled.a`
  box-shadow: 3px 4px 3px rgba(0, 0, 0, 0.427);
  position: relative;
  margin-bottom: 20px;
  border-radius: 10px;
  width: 240px;
  aspect-ratio: 4/3;

  &:hover {
    cursor: pointer;
  }
`;

const Container = styled.div`
  font-family: "Nunito", Fira Sans, Segoe UI, sans-serif;
  display: flex;
  align-self: center;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const SmallContainer = styled(Container)`
  width: fit-content;
  max-width: 240px;
  height: 280px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Info = styled.div`
  width: 90%;
  display: flex;
  align-items: flex-start;
  flex-direction: column;

  @media screen and (min-width: 512px) {
    width: 480px;
  }
`;

const SmallInfo = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-start;
  flex-direction: column;

  a {
    text-decoration: underline;
    color: ${(props) => props.theme.color.primary[600]};
    font-family: inherit;
    font-weight: 600;

    &:hover {
      color: ${(props) => props.theme.color.primary[700]};
    }
  }
`;

const Title = styled.strong`
  font-size: ${(props) => props.theme.fontSize[3]};
`;

const SmallTitle = styled.strong`
  font-size: ${(props) => props.theme.fontSize[2]};
  text-overflow: ellipsis;
  overflow: hidden;
  width: 100%;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  margin: 0;
`;

const VideoPreview = ({ thumbnail_url, name, channel }: VideoPreviewProps) => {
  return (
    <Container>
      <ImageContainer>
        {thumbnail_url && (
          <StyledImage
            src={thumbnail_url}
            alt={name}
            priority
            layout="fill"
            objectFit="contain"
          />
        )}
      </ImageContainer>
      <Info>
        <Title>{name}</Title>
        <Subtitle>{channel}</Subtitle>
      </Info>
    </Container>
  );
};

// eslint-disable-next-line react/display-name
export const SmallVideoPreview = React.forwardRef(
  (
    {
      id,
      thumbnail_url,
      name,
      channel,
      channelId,
      pinned,
      playlists,
      tags,
      ytId,
      getContainerRef,
      prioritize,
    }: VideoPreviewProps & {
      id: string;
      prioritize?: boolean;
      ytId: string;
      pinned: boolean;
      playlists: { videoId: string; playlistId: string }[];
      tags: { videoId: string; tagId: string }[];
      getContainerRef?: () => RefObject<HTMLElement | null>;
    },
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const store = usePlayerStore();
    const { clear, togglePin } = useVideoPreview(channelId);
    const modalStore = useModalStore();
    const [containerRef, setContainerRef] =
      useState<RefObject<HTMLElement | null> | null>(() => {
        return getContainerRef ? getContainerRef() : null;
      });

    const handleSelect = (value: string) => {
      const split = value.split(".");
      if (split.length < 2) {
        return;
      }
      switch (split[0]) {
        case "pin":
          togglePin.mutate({ id: split[1] });
          break;
        case "delete":
          clear.mutate({ id: split[1] });
          break;
        case "playlist":
          modalStore.show(AddVideoToPlaylist, {
            videoId: id,
            playlistsIncluded: playlists,
          });
          break;
        case "tag":
          modalStore.show(UpdateTagsModal, {
            videoId: id,
            existingTags: tags.map((tag) => tag.tagId),
          });
          break;
        default:
          console.log(split[0]);
          break;
      }
    };

    const options = pinned
      ? [
          { label: "Unpin", value: `pin.${id}` },
          { label: "Add to playlist", value: `playlist.${id}` },
          { label: "Update tags", value: `tag.${id}` },
          { label: "Delete", value: `delete.${id}` },
        ]
      : [
          { label: "Pin", value: `pin.${id}` },
          { label: "Add to playlist", value: `playlist.${id}` },
          { label: "Update tags", value: `tag.${id}` },

          { label: "Delete", value: `delete.${id}` },
        ];

    return (
      <SmallContainer ref={ref}>
        <Link href={"/player"}>
          <SmallImageContainer
            onClick={() =>
              store.addNext({
                ytId,
                id,
                name,
                channel,
                channelId,
              })
            }
          >
            {thumbnail_url &&
              (containerRef && containerRef.current ? (
                <StyledImage
                  src={thumbnail_url}
                  alt={name}
                  priority={prioritize}
                  layout="fill"
                  objectFit="contain"
                  lazyBoundary={"20px"}
                  lazyRoot={containerRef as RefObject<HTMLElement>}
                />
              ) : (
                <StyledImage
                  src={thumbnail_url}
                  alt={name}
                  priority={prioritize}
                  layout="fill"
                  objectFit="contain"
                  lazyBoundary={"20px"}
                />
              ))}
          </SmallImageContainer>
        </Link>

        <SmallInfo>
          <SmallTitle title={name}>{name}</SmallTitle>
          <BaseRow width={"100%"} justify={"space-between"}>
            <Link href={`/channels/${channelId}`}>
              <a>
                <Subtitle>{channel}</Subtitle>
              </a>
            </Link>
            <DynamicMenu options={options} onSelect={handleSelect} />
          </BaseRow>
        </SmallInfo>
      </SmallContainer>
    );
  }
);

export default VideoPreview;
