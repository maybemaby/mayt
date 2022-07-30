import Image from "next/image";
import styled from "styled-components";

type VideoPreviewProps = {
  thumbnail_url: string;
  title: string;
  channel: string;
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

const Container = styled.div`
  font-family: "Nunito", Fira Sans, Segoe UI, sans-serif;
  display: flex;
  align-self: center;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const Info = styled.div`
  width: 90%;
  aspect-ratio: 4/3;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  
  @media screen and (min-width: 512px) {
    width: 480px;
    height: 360px;
  }
`;

const Title = styled.strong`
  font-size: ${(props) => props.theme.fontSize[3]};
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

export default VideoPreview;
