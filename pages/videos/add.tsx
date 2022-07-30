import { NextPage } from "next";
import { ChangeEvent, FormEventHandler, useState } from "react";
import styled from "styled-components";
import BaseTextInput from "../../components/common/BaseTextInput";
import VideoPreview from "../../components/VideoPreview";

const FormContainer = styled.form`
  margin: 20px auto 50px auto;
  width: 80%;
  display: flex;
  flex-direction: column;
`;

const SearchInput = styled(BaseTextInput)`
  width: 100%;
  margin-bottom: 10px;
  font-size: ${(props) => props.theme.fontSize[2]};

  @media screen and (min-width: 768px) {
    font-size: ${(props) => props.theme.fontSize[3]};
  }
`;

const OEMBED_ROOT_URL = "https://www.youtube.com/oembed?url=";

interface YTOembedReturn {
  title: string;
  author_name: string;
  author_url: string;
  type: string;
  provider_name: string;
  thumbnail_url: string;
}

const AddVideoPage: NextPage = () => {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [resultFound, setResultFound] = useState<YTOembedReturn | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.currentTarget.value);
  };

  const handleSubmit: FormEventHandler = async (e) => {
    e.preventDefault();
    setError("");
    if (input) {
      const url = new URL(`${OEMBED_ROOT_URL}${input}`);
      const res = await fetch(url, {
        method: "GET",
      });
      if (res.ok) {
        const data = (await res.json()) as YTOembedReturn;
        if (data.type !== "video" || data.provider_name !== "YouTube") {
          setError("Must be from Youtube and not a playlist");
          return;
        }
        setResultFound(data);
      } else {
        setError("Cannot find Youtube video details");
      }
    }
  };

  return (
    <>
      <FormContainer onSubmit={handleSubmit}>
        <SearchInput
          type="text"
          placeholder="Enter a Youtube video URL"
          onChange={handleChange}
        />
        {error && <div>{error}</div>}
      </FormContainer>
      {resultFound && (
        <VideoPreview
          thumbnail_url={resultFound.thumbnail_url}
          title={resultFound.title}
          channel={resultFound.author_name}
        />
      )}
    </>
  );
};

export default AddVideoPage;
