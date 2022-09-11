import type { NextPage } from "next";
import Head from "next/head";
import { useMemo, useState } from "react";
import styled from "styled-components";
import { TbPinned, TbTrendingUp } from "react-icons/tb";
import { SearchBox } from "@components/SearchBox";
import IconHeader from "@components/common/IconHeader";
import VideoPreviewRow from "@components/VideoPreviewRow";
import BarLoader from "@components/common/BarLoader";
import { trpc } from "@lib/utils/trpc";

const PinnedContent = styled.div`
  width: 100%;
  padding: 40px 20px 10px 0;
  background-color: #fcc97693;
  transform: translateY(-12.5%);
  z-index: 1;
  min-height: 300px;
`;

const SecondaryContent = styled.div`
  width: 100%;
  padding: 40px 20px 10px 0;
`;

const StyledIconHeader = styled(IconHeader)`
  margin: 0 auto;
  width: 80%;

  @media screen and (min-width: 768px) {
    margin-left: 80px;
    width: 100%;
  }
`;

const Home: NextPage = () => {
  const [searchValue, setSearchValue] = useState("");
  const { isLoading, data } = trpc.useQuery(
    ["videos.search", { q: searchValue }],
    {
      enabled: searchValue.length > 0,
    }
  );
  const searchResults = useMemo(() => {
    if (data) {
      return data.map((video) => ({ label: video.name, value: video.id }));
    }
    return [];
  }, [data]);

  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  const handleSelect = (value: string) => {
    console.log(value, "clicked");
  };

  const latest = trpc.useQuery(["videos.find", { size: 20 }], {
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
        onSelect={handleSelect}
        results={searchResults}
        delay={300}
        loading={isLoading}
      />
      <PinnedContent>
        <StyledIconHeader Icon={TbPinned} iconProps={{ size: 25 }}>
          Pinned
        </StyledIconHeader>
        <VideoPreviewRow
          loading={pinned.isLoading}
          videos={pinned.data ?? []}
          id={"Pinned"}
          flexWrap={false}
        />
      </PinnedContent>
      <SecondaryContent>
        <StyledIconHeader Icon={TbTrendingUp} iconProps={{ size: 25 }}>
          Recently Added
        </StyledIconHeader>
        {latest.isLoading && (
          <div style={{ margin: "60px 30px" }}>
            <BarLoader />
          </div>
        )}
        {latest.data?.videos && (
          <VideoPreviewRow
            videos={latest.data.videos}
            id={"latest"}
            flexWrap={false}
            loading={latest.isLoading}
          />
        )}
      </SecondaryContent>
    </>
  );
};

export default Home;
