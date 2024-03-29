import { GetStaticProps, NextPage } from "next";
import { ChangeEvent, FormEventHandler, useState } from "react";
import styled from "styled-components";
import { trpc } from "../../lib/utils/trpc";
import BaseTextInput from "../../components/common/BaseTextInput";
import VideoPreview from "../../components/VideoPreview";
import BaseBlockButton from "../../components/common/BaseBlockButton";
import ExpandUp from "../../components/animations/ExpandUp";

const FormContainer = styled.form`
  margin: 20px auto 50px auto;
  width: 80%;
  display: flex;
  flex-direction: column;
`;

const ReplySection = styled.section`
  display: flex;
  flex-direction: row;
  width: 90%;
  margin: 0 auto;
  gap: 20px;
  align-items: center;

  @media screen and (min-width: 512px) {
    width: 480px;
  }
`;

const SearchInput = styled(BaseTextInput)`
  width: 100%;
  margin-bottom: 10px;
  font-size: ${(props) => props.theme.fontSize[2]};
  animation: ${ExpandUp} 300ms linear normal;

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
  thumbnail_width: number;
  thumbnail_height: number;
}

const AddVideoPage: NextPage = () => {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [resultFound, setResultFound] = useState<YTOembedReturn | null>(null);
  const addVideo = trpc.useMutation("videos.create");

  const handleAdd = async () => {
    if (!resultFound) return;

    // Take the video id from the thumbnail url by getting the second part of the path
    // ex: 	"https://i.ytimg.com/vi/kmPgjr0EL64/hqdefault.jpg"
    const id = new URL(resultFound.thumbnail_url).pathname.split("/")[2];
    try {
      await addVideo.mutateAsync({
        name: resultFound.title,
        thumbnailUrl: resultFound.thumbnail_url,
        thumbnailHeight: resultFound.thumbnail_height,
        thumbnailWidth: resultFound.thumbnail_width,
        ytId: id,
        channel: {
          name: resultFound.author_name,
          url: resultFound.author_url,
        },
        pinned: false,
      });
    } catch {}
  };

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
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
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
        <>
          <VideoPreview
            thumbnail_url={resultFound.thumbnail_url}
            name={resultFound.title}
            channel={resultFound.author_name}
          />
          <ReplySection id="replies">
            <BaseBlockButton onClick={handleAdd} padding="8px" margin="10px 0">
              Add to collection
            </BaseBlockButton>
            {addVideo.isLoading && <div>Loading</div>}
            {addVideo.isError && addVideo.error.data?.code === "CONFLICT" ? (
              <div>Video already in collection, cannot add.</div>
            ) : (
              addVideo.isError && <div>Cannot Add to Collection</div>
            )}
            {addVideo.isSuccess && <div>Added!</div>}
          </ReplySection>
        </>
      )}
    </>
  );
};

export default AddVideoPage;

export const getStaticProps: GetStaticProps = (context) => {
  return {
    props: {},
  };
};
