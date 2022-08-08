import { NextPage } from "next";
import styled from "styled-components";
import { useRouter } from "next/router";
import { trpc } from "../../lib/utils/trpc";
import VideoPreviewGrid from "../../components/VideoPreviewGrid";

const Header = styled.section`
  margin: 30px auto;
  width: 90%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-family: inherit;

  strong {
    font-size: ${(props) => props.theme.fontSize[4]};
  }

  a {
    text-decoration: underline;
    color: ${(props) => props.theme.color.primary[500]};
  }
`;

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
      <>
        <Header id="channel-info">
          <strong>{channel.data?.name}</strong>
          <a href={channel.data?.url} target="_blank" rel="noreferrer">
            Youtube Channel Link
          </a>
        </Header>
        {videos.data && videos.data.length > 0 ? (
          <VideoPreviewGrid videos={videos.data} />
        ) : (
          <div>No Videos Found</div>
        )}
      </>
    );
};

export default ChannelPage;
