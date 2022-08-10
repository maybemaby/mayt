import db from "../../data";
import { PostPlaylistDto } from "./models/Playlist";

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

export default {
  createPlaylist,
  getOneById,
  deleteOne,
};
