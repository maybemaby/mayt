import db from "../../data";
import { PostVideoDto } from "./models/Video";
import FindOptions from "../../types/FindOptions";

type FindVideoOptions = FindOptions & {
  channelId?: string;
  playlistId?: string;
  orderBy?: {
    direction: "desc" | "asc";
    prop: "name" | "addedAt";
  };
  matchingTags?: string[];
  query?: string;
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
      name: {
        contains: options.query,
        mode: "insensitive",
      },
    },
  };

  if (options.playlistId) {
    params.where = {
      ...params.where,
      videoPlaylist: {
        some: {
          playlistId: options.playlistId,
        },
      },
    };
  }

  // Coerce options into correct orderBy, or sort by most recent video by default.
  switch (options.orderBy?.prop) {
    case "addedAt":
      params.orderBy = {
        addedAt: options.orderBy.direction,
      };
      break;
    case "name":
      params.orderBy = {
        name: options.orderBy.direction,
      };
      break;
    default:
      params.orderBy = {
        addedAt: "desc",
      };
  }

  if (options.cursor) {
    params.cursor = {
      id: options.cursor,
    };
    params.skip = 1;
  }

  if (options.matchingTags && params.where) {
    params.where.VideoTag = {
      some: {
        tag: {
          name: {
            in: options.matchingTags,
            mode: "insensitive",
          },
        },
      },
    };
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
      videoPlaylist: true,
    },
  });
}

async function searchVideos(query: string) {
  return await db.video.findMany({
    where: {
      OR: [
        {
          name: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          channel: {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
        },
      ],
    },
  });
}

async function getPinned(size: number) {
  return await db.video.findMany({
    where: {
      pinned: true,
    },
    include: {
      channel: true,
      videoPlaylist: true,
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
    take: size,
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

async function removeTag(videoId: string, tagId: string) {
  return await db.videoTag.delete({
    where: {
      videoId_tagId: {
        tagId,
        videoId,
      },
    },
  });
}

async function togglePinned(id: string) {
  const found = await db.video.findUnique({
    where: {
      id,
    },
  });

  if (!found) {
    throw new Error(`Video ${id} not found`);
  }

  return await db.video.update({
    where: {
      id,
    },
    data: {
      pinned: !found.pinned,
    },
  });
}

async function getOne(id: string) {
  return await db.video.findUnique({
    where: {
      id: id,
    },
    include: {
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
      channel: true,
      videoPlaylist: true,
    },
  });
}

const VideoService = {
  createVideo,
  deleteVideo,
  findVideos,
  addTag,
  removeTag,
  getPinned,
  togglePinned,
  getOne,
  searchVideos,
};

export default VideoService;
