import { NextPage } from "next";
import styled from "styled-components";
import VideoPreviewGrid from "../../components/VideoPreviewGrid";
import BarLoader from "../../components/common/BarLoader";
import { trpc } from "../../lib/utils/trpc";
import Modal from "../../components/Modal";
import AddVideoToPlaylist from "../../components/AddVideoToPlaylist";
import { useModal } from "../../hooks/useModal";

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
  const {
    videoPlaylist: { videoId, includedPlaylists },
  } = useModal();

  return (
    <>
      <Header>Videos</Header>
      <Modal>
        {videoId && (
          <AddVideoToPlaylist
            videoId={videoId}
            playlistsIncluded={includedPlaylists ?? []}
          />
        )}
      </Modal>
      {videos.isSuccess && videos.data && videos.isFetchedAfterMount ? (
        <VideoPreviewGrid
          videos={videos.data.pages.map((page) => page.videos).flat()}
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
        <div>No Videos Found</div>
      )}
    </>
  );
};

export default VideosPage;
