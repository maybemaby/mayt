import db from "../../data";

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

const ChannelService = {
  findChannel,
};

export default ChannelService;
