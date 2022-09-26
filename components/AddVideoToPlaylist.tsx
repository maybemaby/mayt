import styled from "styled-components";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { toast } from "react-hot-toast";
import { trpc } from "../lib/utils/trpc";
import { FormEvent, Fragment, useMemo, useState } from "react";
import RaisedBlockButton from "./common/RaisedBlockButton";
import BaseTextInput from "./common/BaseTextInput";
import BarLoader from "./common/BarLoader";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  margin: 30px 0;
  max-height: 500px;
  overflow-y: auto;
  width: 100%;
  font-family: "Poppins", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
`;

const SelectButton = styled.button`
  background-color: transparent;
  min-width: 50px;
  border: none;
  font-family: inherit;
  font-weight: ${(props) => props.theme.fontWeights.subtitle};
  font-size: ${({ theme }) => theme.fontSize[3]};
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
  flex-grow: 5;
  flex-basis: 1;
  flex-shrink: 1;

  &:hover,
  &:active {
    background-color: ${({ theme }) => theme.color.grey[300]};
    cursor: pointer;
  }
`;

const Label = styled.span`
  flex-grow: 1;
  flex-basis: 1;
  flex-shrink: 5;
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  text-align: start;
`;

const Form = styled.form`
  display: flex;
  gap: 10px;
  padding: 10px 5px;
`;

const Fixed = styled.div`
  height: 100px;
  width: 100%;
  margin: auto;
`;

const AddVideoToPlaylist = ({
  videoId,
  playlistsIncluded,
}: {
  videoId: string;
  playlistsIncluded: { videoId: string; playlistId: string }[];
}) => {
  const [newName, setNewName] = useState("");
  const [searchable, setSearchable] = useState(playlistsIncluded);
  const utils = trpc.useContext();
  const playlists = trpc.useQuery(["playlists.find", { size: 1000 }], {
    refetchOnMount: true,
  });
  const add = trpc.useMutation(["playlists.addVideo"], {
    onSuccess(input) {
      toast.success(`Added to playlist!`);
      utils.invalidateQueries(["videos.getPinned"]);
      utils.invalidateQueries(["videos.find"]);
      utils.invalidateQueries(["videos.getOne", input.videoId]);
      setSearchable([
        ...searchable,
        { videoId: input.videoId, playlistId: input.playlistId },
      ]);
    },
  });
  const remove = trpc.useMutation(["playlists.removeVideo"], {
    onSuccess(input) {
      toast.success("Removed from playlist!");
      utils.invalidateQueries(["videos.getPinned"]);
      utils.invalidateQueries(["videos.find"]);
      utils.invalidateQueries(["videos.getOne", input.videoId]);
      setSearchable(
        searchable.filter((pl) => pl.playlistId !== input.playlistId)
      );
    },
  });
  const create = trpc.useMutation(["playlists.create"], {
    onSuccess: () => {
      utils.invalidateQueries(["playlists.find"]);
    },
  });

  const handleAdd = async (playlistId: string) => {
    await add.mutateAsync({ videoId, playlistId });
  };

  const handleRemove = async (playlistId: string) => {
    await remove.mutateAsync({ videoId, playlistId });
  };

  const handleCreate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newName.length > 0) {
      await create.mutateAsync({ name: newName });
    }
  };

  const inPlaylists = useMemo(() => {
    return searchable.map((pl) => pl.playlistId);
  }, [searchable]);

  return (
    <Container>
      {playlists.data && playlists.data.playlists.length === 0 && (
        <div>No Existing Playlists</div>
      )}
      <Form onSubmit={handleCreate}>
        <BaseTextInput
          type="text"
          placeholder="New Playlist"
          value={newName}
          onChange={(e) => setNewName(e.currentTarget.value)}
        />
        <RaisedBlockButton
          style={{ padding: "10px", height: "fit-content" }}
          type="submit"
        >
          Submit
        </RaisedBlockButton>
      </Form>
      {playlists.data &&
        playlists.data.playlists.map((pl) => {
          return (
            <Fragment key={pl.id}>
              {inPlaylists.includes(pl.id) ? (
                <SelectButton
                  key={pl.id}
                  onClick={() => handleRemove(pl.id)}
                  disabled={remove.isLoading}
                >
                  <AiOutlineMinus size={20} />
                  <Label>{pl.name}</Label>
                </SelectButton>
              ) : (
                <SelectButton
                  key={pl.id}
                  onClick={() => handleAdd(pl.id)}
                  disabled={add.isLoading}
                >
                  <AiOutlinePlus size={20} />
                  <Label>{pl.name}</Label>
                </SelectButton>
              )}
            </Fragment>
          );
        })}
      {!playlists.data && (
        <Fixed>
          <BarLoader />
        </Fixed>
      )}
      {remove.isError && <div style={{ color: "red" }}>Failed to remove.</div>}
      {add.isError && add.error.message.includes("duplicate") && (
        <div style={{ color: "red" }}>Already in playlist</div>
      )}
    </Container>
  );
};

export default AddVideoToPlaylist;
