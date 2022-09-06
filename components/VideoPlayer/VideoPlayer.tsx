import styled from "styled-components";
import React, { createContext, useContext } from "react";
import YouTubePlayer, { YouTubeProps } from "react-youtube";
import { Playable } from "@lib/types/Playable";
import Playlist from "@components/Playlist";

type VideoPlayerProps = {
  currentVideo: Playable;
  playlist: Playable[];
  children?: React.ReactNode;
};

const StyledPlayer = styled(YouTubePlayer)`
  width: 100%;
  height: 100%;
  aspect-ratio: auto;

  iframe {
    width: 100%;
    height: 100%;
    aspect-ratio: auto;
  }
`;

const PlayerContainer = styled.div`
  margin: auto;
  width: min(100%, 1000px);
  height: clamp(300px, 40vw, 500px);
`;

const ControlSection = styled.section`
  width: min(500px, 100%);
  margin: 50px auto;

  @media screen and (min-width: 1024px) {
    width: 900px;
  } ;
`;

const VideoPlayerContext = createContext<VideoPlayerProps | null>(null);

export const VideoPlayer = (props: VideoPlayerProps) => {
  return (
    <VideoPlayerContext.Provider value={props}>
      <h2>{props.currentVideo?.name ?? "No Title"}</h2>
      <>{props.children}</>
    </VideoPlayerContext.Provider>
  );
};

interface PlayerProps {
  onEnd: () => void;
  opts: YouTubeProps["opts"];
}

const Player = ({ onEnd, opts }: PlayerProps) => {
  const context = useContext(VideoPlayerContext);

  if (context) {
    return (
      <PlayerContainer>
        <StyledPlayer
          videoId={context?.currentVideo?.ytId ?? ""}
          onEnd={onEnd}
          opts={opts}
        />
      </PlayerContainer>
    );
  }

  return <></>;
};

interface ControlsProps {
  handleNext(): void;
  handlePrev(): void;
  handleSelect(select: {video: Playable, idx: number}): void;
}

const Controls = ({ handleNext, handlePrev, handleSelect }: ControlsProps) => {
  const context = useContext(VideoPlayerContext);

  if (context) {
    return (
      <ControlSection id="controls">
        {context.playlist.length > 0 && (
          <Playlist
            onNext={handleNext}
            onPrev={handlePrev}
            onSelect={handleSelect}
            nowPlaying={context.currentVideo}
            videos={context.playlist}
          />
        )}
      </ControlSection>
    );
  }
  return <></>;
};

VideoPlayer.Player = Player;
VideoPlayer.Controls = Controls;
