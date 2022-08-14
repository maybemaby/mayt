import styled from "styled-components";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { trpc } from "../lib/utils/trpc";
import { useMemo } from "react";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  margin: 30px;
  max-height: 500px;
  overflow-y: auto;
  width: 100%;
  font-family: "Poppins", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
`;

const SelectButton = styled.button`
  width: 100%;
  background-color: transparent;
  border: none;
  font-family: inherit;
  font-weight: ${(props) => props.theme.fontWeights.subtitle};
  font-size: ${({ theme }) => theme.fontSize[3]};
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;

  &:hover,
  &:active {
    background-color: ${({ theme }) => theme.color.grey[300]};
    cursor: pointer;
  }
`;

const AddVideoToPlaylist = ({
  videoId,
  playlistsIncluded,
}: {
  videoId: string;
  playlistsIncluded: { videoId: string; playlistId: string }[];
}) => {
  const utils = trpc.useContext();
  const playlists = trpc.useQuery(["playlists.find", { size: 1000 }], {
    cacheTime: 60,
    refetchOnMount: false,
  });
  const add = trpc.useMutation(["playlists.addVideo"], {
    onSuccess(input) {
      utils.invalidateQueries(["videos.getOne", input.videoId]);
    },
  });

  const handleClick = async (playlistId: string) => {
    await add.mutateAsync({ videoId, playlistId });
  };

  const inPlaylists = useMemo(() => {
    return playlistsIncluded.map((pl) => pl.playlistId);
  }, [playlistsIncluded]);

  return (
    <Container>
      {playlists.data && playlists.data.playlists.length === 0 && (
        <div>No Existing Playlists</div>
      )}
      {playlists.data &&
        playlists.data.playlists.map((pl) => {
          return (
            <SelectButton key={pl.id} onClick={() => handleClick(pl.id)}>
              {inPlaylists.includes(pl.id) ? (
                <AiOutlineMinus size={20} />
              ) : (
                <AiOutlinePlus size={20} />
              )}
              {pl.name}
            </SelectButton>
          );
        })}
      {add.isSuccess && <div style={{ color: "#3da859" }}>Added!</div>}
      {add.isError && add.error.message.includes("duplicate") && (
        <div style={{ color: "red" }}>Already in playlist</div>
      )}
    </Container>
  );
};

export default AddVideoToPlaylist;
