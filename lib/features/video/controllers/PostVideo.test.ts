import { createMocks, MockResponse } from "node-mocks-http";
import handler from "../../../../pages/api/videos";
import { NextApiRequest, NextApiResponse } from "next";
import { GetVideoDto, PostVideoDto } from "../models/Video";
import db from "../../../data";

afterAll(async () => {
  const video = await db.video.findFirst({
    where: {
      name: "Test post",
    },
  });
  if (video)
    await db.video.delete({
      where: {
        id: video?.id,
      },
    });
});

describe("Post video", () => {
  test("Returns successful create", async () => {
    const postBody: PostVideoDto = {
      name: "Test post",
      length: 213123,
      pinned: false,
      ytId: "asdasds",
      channel: {
        name: "Post test channel",
        url: "https://youtube.com/testpost",
      },
      channelId: undefined,
      thumbnailHeight: undefined,
      thumbnailUrl: undefined,
      thumbnailWidth: undefined,
    };

    const {
      req,
      res,
    }: { req: NextApiRequest; res: MockResponse<NextApiResponse> } =
      createMocks({
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: postBody,
      });

    await handler(req, res);

    const data = res._getJSONData() as GetVideoDto;
    expect(res.statusCode).toBe(201);
    expect(data).toBeTruthy();
    expect(data.name).toBe("Test post");
    expect(data.id).toBeTruthy();
    expect(data.length).toBe(213123);
    expect(data.channelId).toBeTruthy();
  });

  test("Returns invalid", async () => {
    const postBody = {
      name: "Test post",
    };

    const {
      req,
      res,
    }: { req: NextApiRequest; res: MockResponse<NextApiResponse> } =
      createMocks({
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: postBody,
      });

    await handler(req, res);

    const data = res._getJSONData() as { message: string; status: number };

    expect(res.statusCode).toBe(400);
    expect(data.message).toBe("Invalid request body");
  });
});
