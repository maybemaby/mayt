import { Video, Channel, VideoTag, TagType } from "@prisma/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { URLSearchParams } from "url";
import { PostVideoDto } from "../lib/features/video/models/Video";

const ENDPOINT_URL = "/api/videos";

type PostResult = Video & {
  channel: Channel | null;
};

type GetAllResult = PostResult & {
  VideoTag: (VideoTag & {
    tag: {
      type: TagType | null;
      name: string;
    };
  })[];
};

type GetAllOptions = {
  channelId?: string;
  last?: string;
  size?: number;
  tag?: string[];
};

async function postVideo(dto: PostVideoDto) {
  const res = await fetch(ENDPOINT_URL, {
    method: "POST",
    body: JSON.stringify(dto),
  });
  if (!res.ok) {
    throw new Error("Cannot process POST to" + ENDPOINT_URL);
  }
  return (await res.json()) as PostResult;
}

// async function getVideos(options: GetAllOptions) {
//   const params = { ...options, size: options?.size?.toString() };
//   const res = await fetch(`${ENDPOINT_URL}?${new URLSearchParams(params)}`, {
//     method: "GET",
//   });
//   if (!res.ok) {
//     throw new Error(`Cannot GET ${ENDPOINT_URL}: ${res.json()}`);
//   }
//   return (await res.json()) as GetAllResult;
// }

type UseVideosProps = {
  getAll: {
    opts: GetAllOptions;
  };
};

// export const useVideos = ({ getAll: { opts } }: UseVideosProps) => {
//   const getAll = useQuery<GetAllResult | Error>(
//     ["videos", opts.channelId, opts.last, opts.size, opts.tag],
//     () => getVideos({ ...opts })
//   );
//   return getAll;
// };

export const usePostVideo = () => {
  const post = useMutation((video: PostVideoDto) => postVideo(video));

  return post;
};
