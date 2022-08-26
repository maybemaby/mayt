import styled from "styled-components";
import { trpc } from "../lib/utils/trpc";
import React, { useState } from "react";
import { BsPlus } from "react-icons/bs";
import { AiOutlineMinus } from "react-icons/ai";
import RaisedBlockButton from "./common/RaisedBlockButton";
import RaisedTextInput from "./common/RaisedTextInput";
import { ButtonBadge } from "./common/Badge";

const StyledInput = styled(RaisedTextInput)`
  width: 100%;
  margin: 0;

  @media screen and (min-width: 768px) {
    width: 50%;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  margin: 30px 20px;
  overflow-y: auto;
  font-family: "Poppins", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  height: 500px;
  width: 90%;
  padding: 10px;

  @media screen and (min-width: 768px) {
    width: 600px;
  }

  @media screen and (min-width: 1024px) {
    width: 900px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  justify-items: flex-start;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;

  @media screen and (min-width: 768px) {
    flex-direction: row;
  }
`;

const TagContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  flex-wrap: wrap;
`;

interface UpdateTagsModalProps {
  videoId: string;
  existingTags: string[];
}

const UpdateTagsModal = ({ videoId, existingTags }: UpdateTagsModalProps) => {
  const utils = trpc.useContext();
  const tags = trpc.useQuery(["tags.find", {}]);
  const addTag = trpc.useMutation(["videos.addTag"], {
    onSuccess: ({ tagId }) => {
      utils.invalidateQueries("videos.find");
      setTagsOnVideo([...tagsOnVideo, tagId]);
    },
  });
  const removeTag = trpc.useMutation(["videos.removeTag"], {
    onSuccess: ({ tagId }) => {
      utils.invalidateQueries("videos.find");
      setTagsOnVideo(tagsOnVideo.filter((id) => id !== tagId));
    },
  });
  const submit = trpc.useMutation(["tags.create"], {
    onSuccess: () => {
      utils.invalidateQueries(["tags.find"]);
      setTimeout(() => {
        submit.reset();
      }, 5000);
    },
  });
  const [tagInput, setTagInput] = useState("");
  const [tagsOnVideo, setTagsOnVideo] = useState(existingTags);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (tagInput.length > 0) {
      await submit.mutateAsync({ name: tagInput });
    }
  };

  const handleBadgeClick = async (action: "add" | "remove", tagId: string) => {
    if (action == "add") {
      await addTag.mutateAsync({ videoId, tagId });
    } else {
      await removeTag.mutateAsync({ videoId, tagId });
    }
  };

  return (
    <Container>
      <Form onSubmit={onSubmit}>
        <StyledInput
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
      <TagContainer>
        {tags.isSuccess &&
          tags.data.map((tag) => {
            if (tagsOnVideo.includes(tag.id)) {
              return (
                <ButtonBadge
                  key={tag.id}
                  onClick={() => handleBadgeClick("remove", tag.id)}
                >
                  <AiOutlineMinus size={20} />
                  {tag.name}
                </ButtonBadge>
              );
            } else {
              return (
                <ButtonBadge
                  key={tag.id}
                  onClick={() => handleBadgeClick("add", tag.id)}
                >
                  <BsPlus size={20} />
                  {tag.name}
                </ButtonBadge>
              );
            }
          })}
      </TagContainer>
    </Container>
  );
};

export default UpdateTagsModal;
