import { createMocks, MockResponse } from "node-mocks-http";
import handler from "../../../../pages/api/videos";
import { NextApiRequest, NextApiResponse } from "next";
import { Channel, Tag, Video } from "@prisma/client";
import VideoService from "../VideoService";
import db from "../../../data";

let happy: Tag;
let sad: Tag;
let lazy: Tag;
let video: Video;
let channel: Channel;

beforeAll(async () => {
  const moods = await db.tagType.create({
    data: {
      name: "mood",
    },
  });

  happy = await db.tag.create({
    data: {
      name: "happy",
      typeId: moods.id,
    },
  });

  sad = await db.tag.create({
    data: {
      name: "sad",
      typeId: moods.id,
    },
  });

  lazy = await db.tag.create({
    data: {
      name: "lazy",
      typeId: moods.id,
    },
  });

  channel = await db.channel.create({
    data: {
      name: "Get channel",
      url: "https://channel1.com",
    },
  });

  video = await db.video.create({
    data: {
      name: "get video 1",
      pinned: false,
      ytId: "as12dva",
      channel: {
        connect: {
          id: channel.id,
        },
      },
    },
  });

  await db.videoTag.create({
    data: {
      videoId: video.id,
      tagId: happy.id,
    },
  });
});

afterAll(async () => {
  await db.tag.deleteMany({});
  await db.channel.deleteMany({});
});

describe("GET Video", () => {
  test("Should return succesfully", async () => {
    const {
      req,
      res,
    }: { req: NextApiRequest; res: MockResponse<NextApiResponse> } =
      createMocks({
        method: "GET",
      });

    await handler(req, res);

    const data = (await res._getJSONData()) as Video[];

    expect(res.statusCode).toBe(200);
    expect(data.length > 0).toBeTruthy();
  });

  test("Should return tagged succesfully", async () => {
    const {
      req,
      res,
    }: { req: NextApiRequest; res: MockResponse<NextApiResponse> } =
      createMocks({
        method: "GET",
        query: {
          tag: "happy",
        },
      });

    await handler(req, res);

    const data = (await res._getJSONData()) as Video[];

    expect(res.statusCode).toBe(200);
    expect(data.length > 0).toBeTruthy();
  });

  test("Should return tagged array succesfully", async () => {
    const {
      req,
      res,
    }: { req: NextApiRequest; res: MockResponse<NextApiResponse> } =
      createMocks({
        method: "GET",
        query: {
          tag: ["happy", "sad"],
        },
      });

    await handler(req, res);

    const data = (await res._getJSONData()) as Video[];

    expect(res.statusCode).toBe(200);
    expect(data.length > 0).toBeTruthy();
  });

  test("Should have none with channelId", async () => {
    const {
      req,
      res,
    }: { req: NextApiRequest; res: MockResponse<NextApiResponse> } =
      createMocks({
        method: "GET",
        query: {
          channelId: "Nonexistent",
        },
      });

    await handler(req, res);
    const data = (await res._getJSONData()) as Video[];

    expect(res.statusCode).toBe(200);
    expect(data.length === 0).toBeTruthy();
  });

  test("Should find with channelId", async () => {
    const {
      req,
      res,
    }: { req: NextApiRequest; res: MockResponse<NextApiResponse> } =
      createMocks({
        method: "GET",
        query: {
          channelId: channel.id,
        },
      });

    await handler(req, res);
    const data = (await res._getJSONData()) as Video[];

    expect(data.length > 0).toBeTruthy();
  });
});
