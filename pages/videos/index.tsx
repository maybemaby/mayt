import { NextPage } from "next";
import styled from "styled-components";
import VideoPreviewGrid from "../../components/VideoPreviewGrid";
import { trpc } from "../../lib/utils/trpc";

const Header = styled.h2`
  font-size: ${(props) => props.theme.fontSize[6]};
  font-weight: ${(props) => props.theme.fontWeights.title};
  margin: 30px;
`;

const VideosPage: NextPage = () => {
  const videos = trpc.useInfiniteQuery(["videos.find", {}], {
    getNextPageParam(last) {
      return last.cursor;
    },
  });
  return (
    <>
      <Header>Videos</Header>
      {videos.isSuccess && videos.data && videos.isFetchedAfterMount ? (
        <VideoPreviewGrid
          videos={videos.data.pages.map((page) => page.videos).flat()}
          onLoad={() => {
            if (videos.hasNextPage) videos.fetchNextPage();
          }}
          loading={videos.isFetchingNextPage}
        />
      ) : videos.isFetching ? (
        <div>Loading</div>
      ) : (
        <div>No Videos Found</div>
      )}
    </>
  );
};

export default VideosPage;
