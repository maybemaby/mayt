import styled from "styled-components";
import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import YouTubePlayer, { YouTubeProps } from "react-youtube";
import { usePlayer } from "../../hooks/usePlayer";
import Playlist from "../../components/Playlist";

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
  max-height: 1000px;
  margin: 50px auto;
  overflow-y: auto;
`;

const PlayerPage: NextPage = () => {
  const player = usePlayer();
  const playerOpts: YouTubeProps["opts"] = {};
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
        <button onClick={() => player.prev()}>Previous</button>
        <button onClick={() => player.next()}>Next</button>
        <Playlist videos={player.watchList} />
      </Controls>
    </Page>
  );
};

export default PlayerPage;

export const getStaticProps: GetStaticProps = (context) => {
  return {
    props: {},
  };
};
