import styled from "styled-components";
import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import YouTubePlayer, { YouTubeProps } from "react-youtube";
import { usePlayer } from "../../hooks/usePlayer";
import Playlist from "../../components/Playlist";
import type { Playable } from "../../lib/types/Playable";

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

const Page = styled.div`
  display: flex;
  flex-direction: column;
  margin: 20px;

  @media screen and (min-width: 768px) {
    margin: 20px 50px;
  }
`;

const PlayerContainer = styled.div`
  margin: auto;
  width: min(100%, 1000px);
  height: clamp(300px, 40vw, 500px);
`;

const Controls = styled.section`
  width: min(500px, 100%);
  margin: 50px auto;

  @media screen and (min-width: 1024px) {
    width: 900px;
  } ;
`;

const PlayerPage: NextPage = () => {
  const player = usePlayer();
  const playerOpts: YouTubeProps["opts"] = {};

  const handleSelect = (video: Playable, idx: number) => {
    player.moveTo(video.id);
  };

  const handleNext = () => {
    player.next();
  };

  const handlePrev = () => {
    player.prev();
  };

  return (
    <Page>
      <Head>
        <title>{`Mayt - ${player.current.title}`}</title>
      </Head>
      <h2>{player.current.title}</h2>
      <PlayerContainer>
        <StyledPlayer
          videoId={player.current.ytId}
          onEnd={() => player.next()}
          opts={playerOpts}
        />
      </PlayerContainer>
      <Controls id="controls">
        <Playlist
          videos={player.watchList}
          onSelect={handleSelect}
          onNext={handleNext}
          onPrev={handlePrev}
          nowPlaying={player.current}
        />
      </Controls>
    </Page>
  );
};

export default PlayerPage;
