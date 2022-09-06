import React, { ForwardedRef, useMemo, useState } from "react";
import styled from "styled-components";
import Image from "next/image";
import BaseRow from "./common/BaseRow";
import Menu from "./Menu";
import { trpc } from "../lib/utils/trpc";
import type { PlaylistLike } from "../lib/types";
import Link from "next/link";
import { usePlayer } from "../hooks/usePlayer";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: fit-content;
  max-width: 240px;
  height: 280px;
  max-height: 280px;
`;

const SmallImageContainer = styled.a`
  box-shadow: 3px 4px 3px rgba(0, 0, 0, 0.427);
  position: relative;
  margin-bottom: 20px;
  border-radius: 10px;
  width: 240px;
  aspect-ratio: 4/3;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    cursor: pointer;
  }
`;

const StyledImage = styled(Image)`
  border-radius: 10px;
`;

const Description = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
`;

const Title = styled.strong`
  font-size: ${(props) => props.theme.fontSize[2]};
  font-family: "Nunito", "Segoe UI", sans-serif;
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  width: 100%;
`;

type PlaylistPreviewProps = {
  playlist: PlaylistLike;
};

const PlaylistPreview = React.forwardRef(function PlaylistPreview(
  { playlist }: PlaylistPreviewProps,
  ref: ForwardedRef<HTMLDivElement>
) {
  const player = usePlayer();
  const utils = trpc.useContext();
  const deletePlaylist = trpc.useMutation(["playlists.deleteOne"], {
    onSuccess() {
      utils.invalidateQueries(["playlists.find"]);
    },
  });

  const options = [{ label: "Delete", value: `delete.${playlist.id}` }];
  const handleMenuSelect = (value: string) => {
    const split = value.split(".");
    if (split.length < 2) {
      return;
    }
    switch (split[0]) {
      case "delete":
        deletePlaylist.mutate(split[1]);
      default:
        console.log(split[0]);
        break;
    }
  };

  return (
    <Container ref={ref}>
      <Link href={"/player"}>
        <SmallImageContainer onClick={() => player.loadPlaylist(playlist.id)}>
          {playlist.videoPlaylist.length > 0 ? (
            <StyledImage
              src={playlist.videoPlaylist[0].video.thumbnail_url ?? ""}
              alt={playlist.videoPlaylist[0].video.name}
              layout="fill"
              objectFit="contain"
            />
          ) : (
            <div>No Videos</div>
          )}
        </SmallImageContainer>
      </Link>
      <Description>
        <Title title={playlist.name}>{playlist.name}</Title>
        <BaseRow width={"100%"} justify={"space-between"}>
          <span>{playlist._count.videoPlaylist} Videos</span>
          <Menu options={options} onSelect={handleMenuSelect} />
        </BaseRow>
      </Description>
    </Container>
  );
});

export default PlaylistPreview;
