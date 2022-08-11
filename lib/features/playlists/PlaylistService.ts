import db from "../../data";
import { PostPlaylistDto } from "./models/Playlist";
import FindOptions from "../../types/FindOptions";
import type { UpdatePlaylistDto } from "./schema/UpdatePlaylistQuery";

type FindPlaylistOptions = FindOptions & {
  orderBy?: {
    createdAt?: "desc" | "asc";
    name?: "desc" | "asc";
  };
};

/**
 *
 * @param dto Object to create playlist from.
 */
async function createPlaylist(dto: PostPlaylistDto) {
  return await db.playlist.create({
    data: { ...dto },
  });
}

/**
 *
 * @param id Id primary key to search for.
 */
async function getOneById(id: string) {
  return await db.playlist.findUnique({
    where: {
      id,
    },
    include: {
      _count: true,
      videoPlaylist: {
        include: {
          video: true,
        },
      },
    },
  });
}

async function find(options: FindPlaylistOptions) {
  const params: Parameters<typeof db.playlist.findMany>[0] = {
    take: options.size ?? 20,
    orderBy: options.orderBy ?? {
      createdAt: "desc",
    },
  };

  if (options.cursor) {
    params.cursor = {
      id: options.cursor,
    };
    params.skip = 1;
  }

  return await db.playlist.findMany({
    ...params,
    include: {
      _count: true,
      videoPlaylist: true,
    },
  });
}

/**
 *
 * @param id Id primary key to delete with. Throws if it doesn't exist.
 */
async function deleteOne(id: string) {
  return await db.playlist.delete({
    where: {
      id,
    },
    select: {
      id: true,
    },
  });
}

async function update(id: string, dto: UpdatePlaylistDto) {
  return await db.playlist.update({
    where: {
      id: id,
    },
    data: {
      ...dto,
    },
  });
}

async function addVideo(videoId: string, playlistId: string) {
  return await db.videoPlaylist.create({
    data: {
      playlistId,
      videoId,
    },
  });
}

async function getAllVideos(playlistId: string) {
  return await db.videoPlaylist.findMany({
    where: {
      playlistId: playlistId,
    },
    orderBy: {
      addedAt: "desc",
    },
    include: {
      video: {
        include: {
          channel: true,
          VideoTag: true,
        },
      },
    },
  });
}

const VideoService = {
  createPlaylist,
  getOneById,
  getAllVideos,
  find,
  deleteOne,
  addVideo,
  update,
};

export default VideoService;
