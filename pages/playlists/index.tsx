import { NextPage } from "next";
import { FormEvent, useMemo, useState } from "react";
import styled from "styled-components";
import { AiOutlinePlus } from "react-icons/ai";
import { useModal } from "../../hooks/useModal";
import BarLoader from "../../components/common/BarLoader";
import { IconButton } from "../../components/common/IconButton";
import Modal from "../../components/Modal";
import { trpc } from "../../lib/utils/trpc";

const Page = styled.section`
  margin: 30px;
`;

const Header = styled.h2`
  font-size: ${(props) => props.theme.fontSize[6]};
  font-weight: ${(props) => props.theme.fontWeights.title};
`;

const StyledIconButton = styled(IconButton)`
  font-family: inherit;
  background-color: transparent;
  border: 3px solid ${(props) => props.theme.color.primary[600]};
  font-size: 1.2rem;
  padding: 10px;
  border-radius: 5px;
  color: ${(props) => props.theme.color.primary[600]};
  width: 200px;
  font-weight: ${(props) => props.theme.fontWeights.subtitle};
  transition: all 100ms linear;
  box-shadow: rgba(0, 0, 0, 0.4) 0 2px 4px, rgba(0, 0, 0, 0.3) 0 7px 13px -3px,
    rgba(44, 69, 107, 0.28) -3px -4px 0px inset;

  &:hover {
    background-color: ${(props) => props.theme.color.grey[200]};
    box-shadow: rgba(0, 0, 0, 0.4) 0 1px 2px, rgba(0, 0, 0, 0.3) 0 5px 7px -3px,
      rgba(44, 69, 107, 0.28) -3px -4px 0px inset;
  }

  &:active {
    box-shadow: rgba(0, 0, 0, 0.4) 0 1px 2px, rgba(0, 0, 0, 0.3) 0 5px 7px -3px,
      rgba(44, 69, 107, 0.28) -1px -1px 0px inset;
    transform: scale(0.97);
  }
`;

const SubmitForm = styled.form`
  margin: 30px 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-family: "Nunito", "Poppins", sans-serif;
  font-weight: ${(props) => props.theme.fontWeights.title};
  font-size: ${(props) => props.theme.fontSize[3]};

  input {
    font-family: inherit;
    padding: 10px;
    font-size: inherit;
    border: 2px solid ${(props) => props.theme.color.primary[600]};
  }
`;

const SubmitButton = styled.button`
  background-color: transparent;
  border: none;
  font-family: inherit;
  font-size: 1.2rem;
  font-weight: 600;
  color: ${(props) => props.theme.color.primary[400]};
  cursor: pointer;
  padding: 0;
  margin-top: 10px;
`;

const PlaylistPage: NextPage = () => {
  const { open } = useModal();
  const [name, setName] = useState("");
  const [submissionError, setSubmissionError] = useState("");
  const utils = trpc.useContext();
  const playlists = trpc.useInfiniteQuery(
    ["playlists.find", { orderBy: { createdAt: "desc" } }],
    {
      getNextPageParam(last) {
        return last.cursor;
      },
    }
  );

  const addPlaylist = trpc.useMutation(["playlists.create"], {
    onSuccess() {
      utils.invalidateQueries(["playlists.find"]);
    },
    onError(e) {
      if (e.message.includes("Entity already exists")) {
        setSubmissionError("Playlist already exists");
      } else {
        setSubmissionError("Couldn't create playlist");
      }
    },
  });

  const playlistData = useMemo(() => {
    if (!playlists.data) {
      return [];
    }
    return playlists.data?.pages.map((page) => page.playlists).flat();
  }, [playlists.data]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmissionError("");
    await addPlaylist.mutateAsync({ name });
  };

  return (
    <Page id="playlist-page">
      <Header>Playlists</Header>
      <Modal>
        <SubmitForm onSubmit={handleSubmit}>
          <label htmlFor="name">Playlist Name</label>
          <input
            id="name"
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
          />
          <SubmitButton type="submit">Submit</SubmitButton>
          {addPlaylist.isLoading && (
            <div style={{ margin: "auto" }}>Loading</div>
          )}
          {addPlaylist.isSuccess && (
            <div style={{ margin: "auto" }}>Added!</div>
          )}
          {submissionError && (
            <div style={{ margin: "auto", color: "red" }}>
              {submissionError}
            </div>
          )}
        </SubmitForm>
      </Modal>
      <StyledIconButton onClick={() => open()}>
        <AiOutlinePlus size={25} />
        New Playlist
      </StyledIconButton>
      {playlists.isSuccess &&
      playlists.data &&
      playlists.isFetchedAfterMount ? (
        <>
          {playlistData.length === 0 && (
            <div style={{ margin: "auto" }}>No Playlists Found</div>
          )}
          {playlistData.map((pl) => {
            return <div key={pl.id}>{pl.name}</div>;
          })}
        </>
      ) : playlists.isFetching ? (
        <div style={{ margin: "auto" }}>
          <BarLoader />
        </div>
      ) : (
        <div style={{ margin: "auto" }}>No Playlists Found</div>
      )}
    </Page>
  );
};

export default PlaylistPage;
