import styled from "styled-components";

const Container = styled.ul`
  display: flex;
  flex-direction: column;
  padding: 0;
  margin: 0;
  width: 100%;
  list-style: none;
  border: 2px solid ${({ theme }) => theme.color.primary[300]};
`;

const PlaylistItem = styled.li`
  padding: 10px 20px;
  border-bottom: 2px solid ${({ theme }) => theme.color.grey[300]};

  &:hover,
  &:focus {
    cursor: pointer;
    background: ${(props) => props.theme.color.secondary[100]};
  }
`;

interface Playable {
  id: string;
  ytId: string;
  title: string;
  channel: string;
  channelId?: string;
}

interface PlaylistProps<T extends Playable> {
  videos: T[];
}

function Playlist<T extends Playable>({ videos }: PlaylistProps<T>) {
  return (
    <Container>
      {videos.map((video, idx) => (
        <PlaylistItem key={video.id} tabIndex={0}>
          {video.title}
        </PlaylistItem>
      ))}
    </Container>
  );
}

export default Playlist;
