import ChannelService from "./ChannelService";
import db from "../../data";
import { Channel } from "@prisma/client";

let channel1: Channel;
const postChannel = {
  name: "First take",
  url: "https://www.youtube.com/channels/firsttake",
};

beforeAll(async () => {
  channel1 = await db.channel.upsert({
    where: {
      name: "Test Channel",
    },
    create: {
      name: "Test Channel",
      url: "https://youtube.com/channel/testchannel",
    },
    update: {
      url: "https://youtube.com/channel/testchannel",
    },
  });
});

afterEach(async () => {
  await db.channel.deleteMany({});
});

describe("ChannelService", () => {
  test("Should find one", async () => {
    const res = await ChannelService.findChannel(channel1.id);
    expect(res).not.toBeNull();
    expect(res?.name).toEqual(channel1.name);
    expect(res?.url).toEqual(channel1.url);
  });

  test("Should return null on find one", async () => {
    const res = await ChannelService.findChannel("nonexistent");
    expect(res).toBeNull();
  });

  test("Should create one", async () => {
    const res = await ChannelService.createOrUpdateChannel(postChannel);
    expect(res.name).toEqual(postChannel.name);
    expect(res.url).toEqual(postChannel.url);
  });

  test("Should update exising one", async () => {
    const res = await ChannelService.createOrUpdateChannel(postChannel);
    expect(res.name).toEqual(postChannel.name);
    expect(res.url).toEqual(postChannel.url);

    const newRes = await ChannelService.createOrUpdateChannel({
      ...postChannel,
      url: "Updated",
    });
    expect(newRes.url).toBe("Updated");
    expect(newRes.name).toEqual(res.name);
    expect(res.id).toEqual(newRes.id);
  });
});
