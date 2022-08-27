import { NextPage } from "next";
import styled from "styled-components";
import VideoFilterForm from "../../components/VideoFilterForm";
import VideoPreviewGrid from "../../components/VideoPreviewGrid";
import BarLoader from "../../components/common/BarLoader";
import { trpc } from "../../lib/utils/trpc";
import Modal from "../../components/Modal";
import AddVideoToPlaylist from "../../components/AddVideoToPlaylist";
import { useModal } from "../../hooks/useModal";
import UpdateTagsModal from "../../components/UpdateTagsModal";
import { VideoForm } from "../../lib/types";
import { useState } from "react";

const Header = styled.h2`
  font-size: ${(props) => props.theme.fontSize[6]};
  font-weight: ${(props) => props.theme.fontWeights.title};
  margin: 30px;
`;

const VideosPage: NextPage = () => {
  const [filters, setFilters] = useState<VideoForm>({});
  const videos = trpc.useInfiniteQuery(
    [
      "videos.find",
      {
        channelId: filters.channel,
        tags: filters.tags,
        orderBy: filters.orderBy,
      },
    ],
    {
      getNextPageParam(last) {
        return last.cursor;
      },
    }
  );
  const channels = trpc.useQuery(["channels.getChannels", {}]);
  const {
    videoPlaylist: { videoId, includedPlaylists },
    tagModal,
  } = useModal();

  const handleFilter = (values: VideoForm) => {
    console.log(values);

    let newValue = { ...values };
    if (values.channel?.length !== undefined && values.channel.length === 0) {
      newValue.channel = undefined;
    }
    if (values.tags?.length !== undefined && values.tags.length === 0) {
      newValue.tags = undefined;
    }
    setFilters(newValue);
  };

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
        {tagModal.videoId && (
          <UpdateTagsModal
            videoId={tagModal.videoId}
            existingTags={tagModal.videoTags ?? []}
          />
        )}
      </Modal>
      <VideoFilterForm
        channels={channels.data ?? []}
        submitHandler={handleFilter}
      />
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
