import styled from "styled-components";
import { NextPage } from "next";
import Head from "next/head";
import type { YouTubeProps } from "react-youtube";
import { VideoPlayer } from "@components/VideoPlayer/VideoPlayer";
import type { Playable } from "@lib/types/Playable";
import { useMemo } from "react";
import { usePlayerStore } from "stores/PlayerStore";

const Page = styled.div`
  display: flex;
  flex-direction: column;
  margin: 20px;

  @media screen and (min-width: 768px) {
    margin: 20px 50px;
  }
`;

const PlayerPage: NextPage = () => {
  const store = usePlayerStore();
  const currentVideo = useMemo(() => {
    return store.upNext[store.nowPlaying];
  }, [store.nowPlaying, store.upNext]);
  const playerOpts: YouTubeProps["opts"] = {};

  const handleSelect = (video: Playable, idx: number) => {
    store.movePlayer({ action: "moveTo", videoId: video.id });
  };

  const handleNext = () => {
    store.movePlayer({ action: "next" });
  };

  const handlePrev = () => {
    store.movePlayer({ action: "prev" });
  };

  return (
    <Page>
      <Head>
        <title>{`Mayt - ${currentVideo?.name}`}</title>
      </Head>
      <VideoPlayer currentVideo={currentVideo} playlist={store.upNext}>
        <VideoPlayer.Player onEnd={() => handleNext()} opts={playerOpts} />
        <VideoPlayer.Controls
          handleNext={handleNext}
          handlePrev={handlePrev}
          handleSelect={handleSelect}
        />
      </VideoPlayer>
    </Page>
  );
};

export default PlayerPage;
