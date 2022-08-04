import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { trpc } from "../../lib/utils/trpc";

const ChannelPage: NextPage = () => {
  const id = useRouter().query.id as string;
  const channel = trpc.useQuery(["channels.byId", { id: id }], {
    enabled: !!id,
  });
  const videos = trpc.useQuery(["videos.find", { channelId: id }], {
    enabled: !!id,
  });

  if (channel.data === null) {
    return (
      <main>
        <div>No Channel Found</div>
      </main>
    );
  } else
    return (
      <main>
        <div>{channel.data?.name}</div>
        <a href={channel.data?.url} target="_blank" rel="noreferrer">
          Channel Link
        </a>
        {videos.data && videos.data.length > 0 ? (
          videos.data.map((video) => {
            return <div key={video.id}>{JSON.stringify(video)}</div>;
          })
        ) : (
          <div>No Videos Found</div>
        )}
      </main>
    );
};

export default ChannelPage;
