import db from "../../data";
import type { PostChannelDto } from "../video/models/Channel";

/**
 *
 * @param id channel id
 * @returns Channel with id or null if not found in database
 */
async function findChannel(id: string) {
  return await db.channel.findUnique({
    where: {
      id: id,
    },
  });
}

async function createOrUpdateChannel(dto: PostChannelDto) {
  return await db.channel.upsert({
    where: {
      name: dto.name,
    },
    create: {
      name: dto.name,
      url: dto.url,
    },
    update: {
      url: dto.url,
    },
  });
}

const ChannelService = {
  findChannel,
  createOrUpdateChannel,
};

export default ChannelService;
