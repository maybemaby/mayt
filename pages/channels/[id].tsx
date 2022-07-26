import { Channel, Video } from "@prisma/client";
import { GetServerSideProps, NextPage } from "next";
import VideoService from "../../lib/features/video/VideoService";
import ChannelService from "../../lib/features/channels/ChannelService";

type ChannelPageProps = {
  videos: Video[];
  channel: Channel | null;
};

const ChannelPage: NextPage<ChannelPageProps> = ({ videos, channel }) => {
  if (channel === null) {
    return (
      <main>
        <div>No Channel Found</div>
      </main>
    );
  }

  return (
    <main>
      {videos.length > 0 ? (
        videos.map((video) => {
          return <div key={video.id}>{JSON.stringify(video)}</div>;
        })
      ) : (
        <div>No Videos Found</div>
      )}
    </main>
  );
};

export default ChannelPage;

export const getServerSideProps: GetServerSideProps<ChannelPageProps> = async (
  context
) => {
  context.res.setHeader(
    "Cache-Control",
    "public, s-maxage=300, stale-while-revalidate=300"
  );

  const id = context.params!.id;

  if (id && typeof id === "string") {
    const channel = await ChannelService.findChannel(id);
    const videos = await VideoService.findVideos({
      channelId: id,
    });
    return {
      props: {
        videos,
        channel,
      },
    };
  } else {
    return {
      props: {
        videos: [],
        channel: null,
      },
    };
  }
};
