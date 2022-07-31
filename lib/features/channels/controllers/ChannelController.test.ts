import { createMocks, MockResponse } from "node-mocks-http";
import handler from "../../../../pages/api/channels";
import { NextApiRequest, NextApiResponse } from "next";
import db from "../../../data";
import { Channel } from "@prisma/client";

afterEach(async () => {
  await db.channel.deleteMany({});
});

describe("ChannelController", () => {
  describe("Post tests", () => {
    test("Posts one", async () => {
      const channel = {
        name: "Test channel",
        url: "https://youtube.com/testchannel",
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
          body: channel,
        });
      await handler(req, res);
      const data = res._getJSONData() as Channel;
      expect(res.statusCode).toBe(201);
      expect(data.name).toBe("Test channel");
      expect(data.url).toBe(channel.url);
      expect(data.id).toBeTruthy();
    });

    test("Invalid body post", async () => {
      const channel = {
        name: "only name",
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
          body: channel,
        });

      await handler(req, res);
      expect(res.statusCode).toBe(400);
    });

    test("Invalid url, should fail schema check", async () => {
      const channel = {
        name: "Valid name",
        url: "Not valid url",
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
          body: channel,
        });

      await handler(req, res);

      expect(res.statusCode).toBe(400);
    });
  });
});
