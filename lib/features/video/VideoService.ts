import db from "../../data";
import { PostVideoDto } from "./models/Video";
import FindOptions from "../../types/FindOptions";

type FindVideoOptions = FindOptions & {
  channelId?: string;
  orderBy?: {
    addedAt: "desc" | "asc";
  };
};

async function createVideo(dto: PostVideoDto) {
  return await db.video.create({
    data: { ...dto },
    include: {
      channel: true,
    },
  });
}

async function deleteVideo(id: string) {
  return await db.video.delete({
    where: {
      id: id,
    },
  });
}

async function findVideos(options: FindVideoOptions) {
  if (options.cursor) {
    return await db.video.findMany({
      cursor: {
        id: options.cursor || undefined,
      },
      take: options.size || 20,
      where: {
        channelId: options.channelId,
      },
      orderBy: {
        addedAt: options.orderBy?.addedAt || "desc",
      },
      include: {
        channel: true,
      },
    });
  }
  return await db.video.findMany({
    take: options.size || 20,
    where: {
      channelId: options.channelId,
    },
    orderBy: {
      addedAt: options.orderBy?.addedAt || "desc",
    },
    include: {
      channel: true,
    },
  });
}

const VideoService = {
  createVideo,
  deleteVideo,
  findVideos,
};

export default VideoService;
