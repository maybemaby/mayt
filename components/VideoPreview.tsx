import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";
import { trpc } from "../lib/utils/trpc";

type VideoPreviewProps = {
  thumbnail_url: string;
  title: string;
  channel: string;
  channelId?: string;
};

const StyledImage = styled(Image)`
  border-radius: 10px;
`;

const ImageContainer = styled.div`
  box-shadow: 3px 4px 3px rgba(0, 0, 0, 0.427);
  position: relative;
  margin-bottom: 20px;
  border-radius: 10px;
  width: 90%;
  aspect-ratio: 4/3;

  @media screen and (min-width: 512px) {
    width: 480px;
    height: 360px;
  }
`;

const SmallImageContainer = styled.div`
  box-shadow: 3px 4px 3px rgba(0, 0, 0, 0.427);
  position: relative;
  margin-bottom: 20px;
  border-radius: 10px;
  width: 240px;
  aspect-ratio: 4/3;
`;

const Container = styled.div`
  font-family: "Nunito", Fira Sans, Segoe UI, sans-serif;
  display: flex;
  align-self: center;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const SmallContainer = styled(Container)`
  width: fit-content;
  max-width: 240px;
  align-self: unset;
`;

const Info = styled.div`
  width: 90%;
  display: flex;
  align-items: flex-start;
  flex-direction: column;

  @media screen and (min-width: 512px) {
    width: 480px;
  }
`;

const SmallInfo = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-start;
  flex-direction: column;

  a {
    text-decoration: underline;
    color: ${(props) => props.theme.color.primary[600]};
    font-family: inherit;
    font-weight: 600;

    &:hover {
      color: ${(props) => props.theme.color.primary[700]};
    }
  }
`;

const Title = styled.strong`
  font-size: ${(props) => props.theme.fontSize[3]};
`;

const SmallTitle = styled.strong`
  font-size: ${(props) => props.theme.fontSize[2]};
`;

const Subtitle = styled.p`
  font-size: 1rem;
`;

const VideoPreview = ({ thumbnail_url, title, channel }: VideoPreviewProps) => {
  return (
    <Container>
      <ImageContainer>
        <StyledImage
          src={thumbnail_url}
          alt={title}
          priority
          layout="fill"
          objectFit="contain"
        />
      </ImageContainer>
      <Info>
        <Title>{title}</Title>
        <Subtitle>{channel}</Subtitle>
      </Info>
    </Container>
  );
};

export const SmallVideoPreview = ({
  id,
  thumbnail_url,
  title,
  channel,
  channelId,
}: VideoPreviewProps & { id: string }) => {
  const utils = trpc.useContext();
  const clear = trpc.useMutation("videos.delete", {
    onSuccess(input) {
      utils.invalidateQueries(["videos.find"]);
      utils.invalidateQueries(["videos.getPinned"]);
      utils.invalidateQueries(["videos.find", { channelId }]);
    },
  });
  const handleDelete = async (id: string) => {
    await clear.mutateAsync({ id });
  };

  return (
    <SmallContainer>
      <SmallImageContainer>
        <StyledImage
          src={thumbnail_url}
          alt={title}
          priority
          layout="fill"
          objectFit="contain"
        />
      </SmallImageContainer>
      <SmallInfo>
        <SmallTitle>{title}</SmallTitle>
        <Link href={`/channels/${channelId}`}>
          <a>
            <Subtitle>{channel}</Subtitle>
          </a>
        </Link>
      </SmallInfo>
      <button onClick={async () => await handleDelete(id)}>Delete</button>
    </SmallContainer>
  );
};

export default VideoPreview;
