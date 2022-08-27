import db from "../../data";
import FindOptions from "../../types/FindOptions";
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

interface ChannelFilter extends FindOptions {
  nameContains?: string;
}

async function getChannels(options: ChannelFilter) {
  const params: Parameters<typeof db.channel.findMany>[0] = {
    take: options.size,
    where: {
      name: {
        contains: options.nameContains,
      },
    },
  };

  if (options.cursor) {
    params.cursor = {
      id: options.cursor,
    };
  }

  return await db.channel.findMany({ ...params });
}

const ChannelService = {
  findChannel,
  createOrUpdateChannel,
  getChannels,
};

export default ChannelService;
