import { Video } from "@prisma/client";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { SearchBox } from "../components/SearchBox";
import VideoService from "../lib/features/video/VideoService";

type HomeProps = {
  pinnedVideos: Video[];
  latestVideos: Video[];
};

const Home: NextPage<HomeProps> = ({ pinnedVideos, latestVideos }) => {
  const [searchLoading, setSearchLoading] = useState(false);
  const handleSearch = (value: string) => {
    setSearchLoading(true);
    setTimeout(() => {
      console.log(value);
      setSearchLoading(false);
    }, 300);
  };

  return (
    <>
      <Head>
        <title>Mayt</title>
        <meta name="description" content="Your personal Youtube organizer" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SearchBox
        commonStyle={{ margin: "30px 0px" }}
        placeholder="Search by videos by title or channel"
        onSearch={handleSearch}
        results={[
          { label: "Found 1", value: "value 1" },
          { label: "Found 2", value: "value 2" },
        ]}
        delay={300}
        loading={searchLoading}
      />
    </>
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
