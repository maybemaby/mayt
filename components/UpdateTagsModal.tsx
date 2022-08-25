import styled from "styled-components";
import { trpc } from "../lib/utils/trpc";
import React, { useState } from "react";
import RaisedBlockButton from "./common/RaisedBlockButton";
import RaisedTextInput from "./common/RaisedTextInput";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  margin: 30px 0;
  overflow-y: auto;
  width: 100%;
  font-family: "Poppins", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  height: 700px;
  width: 400px;

  @media screen and (min-width: 768px) {
    width: 600px;
  }

  @media screen and (min-width: 1024px) {
    width: 900px;
  }
`;

const Form = styled.form`
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 20px;
`;

interface UpdateTagsModalProps {
  videoId: string;
}

const UpdateTagsModal = ({ videoId }: UpdateTagsModalProps) => {
  const utils = trpc.useContext();
  const tags = trpc.useQuery(["tags.find", {}]);
  const submit = trpc.useMutation(["tags.create"], {
    onSuccess: () => {
      utils.invalidateQueries(["tags.find"]);
      setTimeout(() => {
        submit.reset();
      }, 5000);
    },
  });
  const [tagInput, setTagInput] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (tagInput.length > 0) {
      await submit.mutateAsync({ name: tagInput });
    }
  };

  return (
    <Container>
      <Form onSubmit={onSubmit}>
        <RaisedTextInput
          type="text"
          placeholder="New Tag"
          value={tagInput}
          onChange={(e) => setTagInput(e.currentTarget.value)}
        />
        <RaisedBlockButton type="submit">Submit</RaisedBlockButton>
        {submit.isLoading && <span>Loading...</span>}
        {submit.isSuccess && !submit.isIdle && <span>Added!</span>}
        {submit.isError && <span>Could not create tag</span>}
      </Form>

      {tags.isSuccess &&
        tags.data.map((tag) => {
          return <div key={tag.id}>{tag.name}</div>;
        })}
    </Container>
  );
};

export default UpdateTagsModal;
