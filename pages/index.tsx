import { Video } from "@prisma/client";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { BaseSidebar } from "../components/common/BaseSidebar";
import VideoService from "../lib/features/video/VideoService";

type HomeProps = {
  pinnedVideos: Video[];
  latestVideos: Video[];
};

const Home: NextPage<HomeProps> = ({ pinnedVideos, latestVideos }) => {
  return (
    <div>
      <Head>
        <title>Mayt</title>
        <meta name="description" content="Your personal Youtube organizer" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      Hello World
    </div>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps<HomeProps> = async (
  context
) => {
  const latest = await VideoService.findVideos({
    orderBy: {
      addedAt: "desc",
    },
    size: 100,
  });

  const pinned = await VideoService.getPinned(100);

  return {
    props: {
      latestVideos: latest,
      pinnedVideos: pinned,
    },
  };
};
