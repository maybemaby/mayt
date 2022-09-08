import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useMemo } from "react";
import styled from "styled-components";
import { VideoPlayer } from "@components/VideoPlayer/VideoPlayer";
import { Playable } from "@lib/types/Playable";
import { trpc } from "@lib/utils/trpc";
import { usePlaylist } from "@hooks/usePlaylist";

const Page = styled.div`
  display: flex;
  flex-direction: column;
  margin: 20px;

  @media screen and (min-width: 768px) {
    margin: 20px 50px;
  }
`;

const PlaylistDetail: NextPage = () => {
  const id = useRouter().query.id as string;
  const playlistVideos = trpc.useQuery(["videos.find", { playlistId: id }], {
    enabled: !!id,
  });
  const videos = useMemo(() => {
    if (playlistVideos.isSuccess) {
      return playlistVideos.data.videos.map((video): Playable => {
        return {
          name: video.name,
          channel: video.channel?.name ?? "",
          ytId: video.ytId,
          id: video.id,
          channelId: video.channelId ?? "",
        };
      });
    }
    return [];
  }, [playlistVideos.data]);
  const controller = usePlaylist({ length: videos.length });
  const playlist = trpc.useQuery(["playlists.getOne", id]);

  return (
    <Page>
      <Head>
        <title>Playlist - {playlist.isSuccess && playlist.data?.name}</title>
      </Head>

      <VideoPlayer playlist={videos} currentVideo={videos[controller.current]}>
        <VideoPlayer.Player opts={{}} onEnd={() => controller.next()} />
        <VideoPlayer.Controls
          handleNext={() => controller.next()}
          handlePrev={() => controller.prev()}
          handleSelect={({ idx }) => controller.select(idx)}
        />
      </VideoPlayer>
    </Page>
  );
};

export default PlaylistDetail;
