import React, { ForwardedRef } from "react";
import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";
import { trpc } from "../lib/utils/trpc";
import BaseRow from "./common/BaseRow";
import Menu from "./Menu";
import { useModal } from "../hooks/useModal";
import { usePlayer } from "../hooks/usePlayer";

type VideoPreviewProps = {
  thumbnail_url: string;
  title: string;
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

const VideoPreview = ({ thumbnail_url, title, channel }: VideoPreviewProps) => {
  return (
    <Container>
      <ImageContainer>
        <StyledImage
          src={thumbnail_url}
          alt={title}
          priority
          layout="fill"
          objectFit="contain"
        />
      </ImageContainer>
      <Info>
        <Title>{title}</Title>
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
      title,
      channel,
      channelId,
      pinned,
      playlists,
      tags,
      ytId,
    }: VideoPreviewProps & {
      id: string;
      ytId: string;
      pinned: boolean;
      playlists: { videoId: string; playlistId: string }[];
      tags: { videoId: string; tagId: string }[];
    },
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const player = usePlayer();
    const utils = trpc.useContext();
    const clear = trpc.useMutation("videos.delete", {
      onSuccess(input) {
        utils.invalidateQueries(["videos.find"]);
        utils.invalidateQueries(["videos.getPinned"]);
        utils.invalidateQueries(["videos.find", { channelId }]);
      },
    });
    const togglePin = trpc.useMutation("videos.togglePinned", {
      onSuccess(input) {
        utils.invalidateQueries(["videos.find"]);
        utils.invalidateQueries(["videos.getPinned"]);
      },
    });

    const {
      open,
      videoPlaylist: { setVideoId, setIncludedPlaylists },
      tagModal,
    } = useModal();

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
          if (setVideoId && setIncludedPlaylists) {
            setVideoId(split[1]);
            setIncludedPlaylists(playlists);
          }
          open();
          break;
        case "tag":
          if (tagModal.setVideoId && tagModal.setVideoTags) {
            tagModal.setVideoId(split[1]);
            tagModal.setVideoTags(tags.map((tag) => tag.tagId));
          }
          open();
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
              player.appendVideos([
                {
                  ytId,
                  id,
                  thumbnail_url,
                  title,
                  channel,
                  channelId,
                  pinned,
                  playlists,
                  tags,
                },
              ])
            }
          >
            <StyledImage
              src={thumbnail_url}
              alt={title}
              priority
              layout="fill"
              objectFit="contain"
            />
          </SmallImageContainer>
        </Link>

        <SmallInfo>
          <SmallTitle title={title}>{title}</SmallTitle>
          <BaseRow width={"100%"} justify={"space-between"}>
            <Link href={`/channels/${channelId}`}>
              <a>
                <Subtitle>{channel}</Subtitle>
              </a>
            </Link>
            <Menu options={options} onSelect={handleSelect} />
          </BaseRow>
        </SmallInfo>
      </SmallContainer>
    );
  }
);

export default VideoPreview;
