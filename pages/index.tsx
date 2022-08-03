import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import styled from "styled-components";
import { TbPinned, TbTrendingUp } from "react-icons/tb";
import { SearchBox } from "../components/SearchBox";
import IconHeader from "../components/common/IconHeader";
import VideoPreviewRow from "../components/VideoPreviewRow";
import VideoService from "../lib/features/video/VideoService";
import type { AsyncReturnType } from "../lib/types/AsyncReturnType";
import type { Unpacked } from "../lib/types/Unpacked";
import { trpc } from "../lib/utils/trpc";

// export type HomeProps = {
//   pinnedVideos: AsyncReturnType<typeof VideoService["getPinned"]>;
//   latestVideos: (Omit<
//     Unpacked<AsyncReturnType<typeof VideoService["findVideos"]>>,
//     "addedAt"
//   > & { addedAt: string })[];
// };

const PinnedContent = styled.div`
  width: 100%;
  padding: 40px 20px 10px 0px;
  background-color: #fcc97693;
  transform: translateY(-12.5%);
  z-index: 1;
  min-height: 300px;
`;

const SecondaryContent = styled.div`
  width: 100%;
  padding: 40px 20px 10px 0px;
`;

const StyledIconHeader = styled(IconHeader)`
  margin: 0px auto;
  width: 80%;

  @media screen and (min-width: 768px) {
    margin-left: 80px;
    width: 100%;
  }
`;

const Home: NextPage = () => {
  const [searchLoading, setSearchLoading] = useState(false);
  const handleSearch = (value: string) => {
    setSearchLoading(true);
    setTimeout(() => {
      console.log(value);
      setSearchLoading(false);
    }, 300);
  };
  const latest = trpc.useQuery(["videos.find", {}], {
    staleTime: 60,
  });
  const pinned = trpc.useQuery(["videos.getPinned", {}], {
    staleTime: 60,
  });

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
      <PinnedContent>
        <StyledIconHeader Icon={TbPinned} iconProps={{ size: 25 }}>
          Pinned
        </StyledIconHeader>
        <VideoPreviewRow
          videos={pinned.data ?? []}
          id={"Pinned"}
          flexWrap={false}
        />
      </PinnedContent>
      <SecondaryContent>
        <StyledIconHeader Icon={TbTrendingUp} iconProps={{ size: 25 }}>
          Recently Added
        </StyledIconHeader>
        {latest.isLoading && <div>Loading</div>}
        {latest.data && (
          <VideoPreviewRow
            videos={latest.data}
            id={"latest"}
            flexWrap={false}
          />
        )}
      </SecondaryContent>
    </>
  );
};

export default Home;

// export const getServerSideProps: GetServerSideProps<HomeProps> = async (
//   context
// ) => {
//   context.res.setHeader(
//     "Cache-Control",
//     "public, s-maxage=20, stale-while-revalidate=60"
//   );

//   const latest = await VideoService.findVideos({
//     orderBy: {
//       addedAt: "desc",
//     },
//     size: 100,
//   });

//   // Consider using JSON.parse(JSON.stringify(latest)) instead

//   const videos = latest.map((video) => {
//     return { ...video, addedAt: video.addedAt.toDateString() };
//   });

//   const pinned = await VideoService.getPinned(100);

//   return {
//     props: {
//       latestVideos: videos,
//       pinnedVideos: pinned,
//     },
//   };
// };
