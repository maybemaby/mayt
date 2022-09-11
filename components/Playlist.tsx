import styled from "styled-components";
import Link from "next/link";
import {
  BsPlayFill,
  BsFillSkipBackwardFill,
  BsFillSkipForwardFill,
} from "react-icons/bs";
import type { Playable } from "@lib/types/Playable";
import { IconButton } from "./common/IconButton";

const Container = styled.ul`
  font-family: "Nunito", Oxygen, sans-serif;
  display: flex;
  flex-direction: column;
  padding: 0;
  margin: 0;
  width: 100%;
  list-style: none;
  border: 2px solid ${({ theme }) => theme.color.primary[300]};
  max-height: 500px;
  overflow-y: auto;
  position: relative;
`;

const PlaylistHeader = styled.div`
  font-family: "Poppins", sans-serif;
  display: flex;
  gap: 20px;
  padding: 10px 20px;
  color: ${({ theme }) => theme.color.secondary[400]};
  background: ${({ theme }) => theme.color.primary[700]};
  position: sticky;
  top: 0;
  width: 100%;
  text-overflow: ellipsis;
`;

const PlaylistItem = styled.li<{ playing?: boolean }>`
  padding: 10px 20px;
  border-bottom: 2px solid ${({ theme }) => theme.color.grey[300]};
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
  background: ${(props) =>
    props.playing ? props.theme.color.primary[50] : "unset"};

  &:hover,
  &:focus-within {
    cursor: pointer;
    background: ${(props) =>
      props.playing
        ? props.theme.color.primary[50]
        : props.theme.color.grey[50]};
  }

  strong {
    font-size: ${(props) => props.theme.fontSize[32]};
    margin-bottom: 10px;
  }

  a {
    color: ${(props) => props.theme.color.grey[700]};
    width: fit-content;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const ItemInfo = styled.span`
  display: flex;
  flex-direction: column;

  strong {
    font-size: ${(props) => props.theme.fontSize[32]};
    margin-bottom: 10px;
  }

  a {
    color: ${(props) => props.theme.color.grey[700]};
    width: fit-content;

    &:hover {
      text-decoration: underline;
    }
  }
`;

interface PlaylistProps<T extends Playable> {
  videos: T[];
  onNext(): void;
  onPrev(): void;
  onSelect(select: { video: T; idx: number }): void;
  nowPlaying?: T;
}

function Playlist<T extends Playable>({
  videos,
  onNext,
  onPrev,
  onSelect,
  nowPlaying,
}: PlaylistProps<T>) {
  return (
    <Container>
      <PlaylistHeader>
        <IconButton onClick={() => onPrev()}>
          <BsFillSkipBackwardFill size={20} />
        </IconButton>
        <IconButton onClick={() => onNext()}>
          <BsFillSkipForwardFill size={20} />
        </IconButton>
        <span style={{ fontWeight: "600" }}>
          Now Playing - {nowPlaying?.name}
        </span>
      </PlaylistHeader>
      {nowPlaying &&
        videos.map((video, idx) => (
          <PlaylistItem
            key={video.id}
            tabIndex={0}
            onClick={() => onSelect({ video, idx })}
            playing={nowPlaying.id === video.id}
          >
            {nowPlaying.id === video.id && (
              <BsPlayFill size={30} color={"#4F75AE"} />
            )}
            <ItemInfo>
              <strong>{video.name}</strong>
              <Link href={`/channels/${video.channelId}`}>
                <a>{video.channel}</a>
              </Link>
            </ItemInfo>
          </PlaylistItem>
        ))}
    </Container>
  );
}

export default Playlist;
