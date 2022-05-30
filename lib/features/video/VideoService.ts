import db from "../../data";
import { PostVideoDto } from "./models/Video";
import FindOptions from "../../types/FindOptions";

type FindVideoOptions = FindOptions & {
  channelId?: string;
  orderBy?: {
    addedAt: "desc" | "asc";
  };
  matchingTags?: string[];
};

/**
 * Inserts new Video record to table. If channel in body does not exist based on name as key,
 * creates it and then references it.
 * @param dto PostVideoDto Body to create new Video record
 * @returns
 */
async function createVideo(dto: PostVideoDto) {
  return await db.video.create({
    data: {
      name: dto.name,
      pinned: dto.pinned,
      ytId: dto.ytId,
      length: dto.length,
      thumbnail_height: dto.thumbnailHeight,
      thumbnail_url: dto.thumbnailUrl,
      thumbnail_width: dto.thumbnailWidth,
      channel: {
        connectOrCreate: {
          create: {
            name: dto.channel.name,
            url: dto.channel.url,
          },
          where: {
            name: dto.channel.name,
          },
        },
      },
    },
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
  const params: Parameters<typeof db.video.findMany>[0] = {
    take: options.size || 20,
    where: {
      channelId: options.channelId,
    },
    orderBy: {
      addedAt: options.orderBy?.addedAt || "desc",
    },
  };

  if (options.cursor) {
    params.cursor = {
      id: options.cursor,
    };
  }

  if (options.matchingTags && params.where) {
    params.where.VideoTag = {
      some: {
        tag: {
          name: {
            in: options.matchingTags,
          },
        },
      },
    };
  }

  if (options.cursor) {
    return await db.video.findMany({
      ...params,
      include: {
        channel: true,
        VideoTag: {
          include: {
            tag: {
              select: {
                name: true,
                type: true,
              },
            },
          },
        },
      },
    });
  }
  return await db.video.findMany({
    ...params,
    include: {
      channel: true,
      VideoTag: {
        include: {
          tag: {
            select: {
              name: true,
              type: true,
            },
          },
        },
      },
    },
  });
}

async function addTag(videoId: string, tagId: string) {
  return await db.videoTag.create({
    data: {
      tagId: tagId,
      videoId: videoId,
    },
  });
}

const VideoService = {
  createVideo,
  deleteVideo,
  findVideos,
  addTag,
};

export default VideoService;