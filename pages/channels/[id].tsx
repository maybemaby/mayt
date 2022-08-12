import { NextPage } from "next";
import styled from "styled-components";
import { useRouter } from "next/router";
import { trpc } from "../../lib/utils/trpc";
import VideoPreviewGrid from "../../components/VideoPreviewGrid";
import { useMemo } from "react";
import BarLoader from "../../components/common/BarLoader";

const Header = styled.section`
  padding: 30px 50px 20px 50px;
  margin: 0 auto 30px auto;
  width: 90%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-family: inherit;
  background-color: ${(props) => props.theme.color.secondary[50]};
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.4) 0 2px 4px, rgba(0, 0, 0, 0.3) 0 7px 13px -3px,
    rgba(0, 0, 0, 0.2) 0px -3px 0px inset;

  @media screen and (min-width: 768px) {
    border-radius: 0 0 10px 10px;
  }

  strong {
    font-size: ${(props) => props.theme.fontSize[4]};
  }

  a {
    text-decoration: underline;
    color: ${(props) => props.theme.color.primary[500]};
    transition: color 200ms ease;
    width: fit-content;

    &:hover {
      color: ${(props) => props.theme.color.primary[600]};
    }
  }
`;

const ChannelPage: NextPage = () => {
  const id = useRouter().query.id as string;
  const channel = trpc.useQuery(["channels.byId", { id: id }], {
    enabled: !!id,
  });
  const videos = trpc.useInfiniteQuery(["videos.find", { channelId: id }], {
    enabled: !!id,
    getNextPageParam(last) {
      return last.cursor;
    },
  });

  const videoData = useMemo(() => {
    if (!videos.data) {
      return [];
    }
    return videos.data?.pages.map((page) => page.videos).flat();
  }, [videos.data]);

  if (channel.data === null) {
    return (
      <main>
        <div>No Channel Found</div>
      </main>
    );
  } else
    return (
      <>
        <Header id="channel-info">
          <strong>
            {channel.isLoading ? "Loading..." : channel.data?.name}
          </strong>
          <a href={channel.data?.url} target="_blank" rel="noreferrer">
            Youtube Channel Link
          </a>
        </Header>
        {videos.isSuccess && videos.data && videos.isFetchedAfterMount ? (
          <VideoPreviewGrid
            videos={videoData}
            onLoad={() => {
              if (videos.hasNextPage) videos.fetchNextPage();
            }}
            loading={videos.isFetchingNextPage}
          />
        ) : videos.isFetching ? (
          <div style={{ margin: "auto" }}>
            <BarLoader />
          </div>
        ) : (
          <div style={{ margin: "auto" }}>No Videos Found</div>
        )}
      </>
    );
};

export default ChannelPage;
