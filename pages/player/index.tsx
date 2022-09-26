import styled from "styled-components";
import { NextPage } from "next";
import Head from "next/head";
import type { YouTubeProps } from "react-youtube";
import { VideoPlayer } from "@components/VideoPlayer/VideoPlayer";
import type { Playable } from "@lib/types/Playable";
import { useEffect, useMemo } from "react";
import { usePlayerStore } from "stores/PlayerStore";
import { useRouter } from "next/router";
import { useFindVideoLazy } from "@hooks/useFindVideo";

const Page = styled.div`
  display: flex;
  flex-direction: column;
  margin: 20px;

  @media screen and (min-width: 768px) {
    margin: 20px 50px;
  }
`;

const PlayerPage: NextPage = () => {
  const router = useRouter();
  const videoIdQuery = useMemo(() => {
    if (!Array.isArray(router.query.v)) return router.query.v;
  }, [router]);
  const videoRouted = useFindVideoLazy(videoIdQuery);
  const store = usePlayerStore();
  const currentVideo = useMemo(() => {
    return store.upNext[store.nowPlaying];
  }, [store.nowPlaying, store.upNext]);
  const playerOpts: YouTubeProps["opts"] = {};

  const handleSelect = (select: { video: Playable; idx: number }) => {
    store.movePlayer({ action: "moveTo", videoId: select.video.id });
  };

  const handleNext = () => {
    store.movePlayer({ action: "next" });
  };

  const handlePrev = () => {
    store.movePlayer({ action: "prev" });
  };

  useEffect(() => {
    const video = videoRouted.video.data;
    if (video && !store.upNext.find((item) => item.id === video.id)) {
      store.addNext({
        channel: video.channel?.name ?? "",
        id: video.id,
        name: video.name,
        ytId: video.ytId,
        channelId: video.channelId ?? "",
      });
    }
  }, [videoRouted.video.isSuccess]);

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
