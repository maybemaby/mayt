import { Video } from "@prisma/client";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { SearchBox } from "../components/SearchBox";
import VideoService from "../lib/features/video/VideoService";
import type { AsyncReturnType } from "../lib/types/AsyncReturnType";
import type { Unpacked } from "../lib/types/Unpacked";

type HomeProps = {
  pinnedVideos: AsyncReturnType<typeof VideoService["getPinned"]>;
  latestVideos: (Omit<
    Unpacked<AsyncReturnType<typeof VideoService["findVideos"]>>,
    "addedAt"
  > & { addedAt: string })[];
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
      <div>{JSON.stringify(latestVideos)}</div>
    </>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps<HomeProps> = async (
  context
) => {
  context.res.setHeader(
    "Cache-Control",
    "public, s-maxage=20, stale-while-revalidate=60"
  );

  const latest = await VideoService.findVideos({
    orderBy: {
      addedAt: "desc",
    },
    size: 100,
  });

  // Consider using JSON.parse(JSON.stringify(latest)) instead

  const videos = latest.map((video) => {
    return { ...video, addedAt: video.addedAt.toDateString() };
  });

  const pinned = await VideoService.getPinned(100);

  return {
    props: {
      latestVideos: videos,
      pinnedVideos: pinned,
    },
  };
};
