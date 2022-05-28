import { createMocks, MockResponse } from "node-mocks-http";
import handler from "../../../../pages/api/videos/[id]";
import { NextApiRequest, NextApiResponse } from "next";
import db from "../../../data";
import { Video } from "@prisma/client";

let video: Video;

beforeEach(async () => {
  video = await db.video.create({
    data: {
      name: "Test delete",
      pinned: false,
      ytId: "1234",
    },
  });
});

describe("Delete video", () => {
  test("Returns successful status", async () => {
    const {
      req,
      res,
    }: { req: NextApiRequest; res: MockResponse<NextApiResponse> } =
      createMocks({
        method: "DELETE",
        query: {
          id: video.id,
        },
      });
    await handler(req, res);

    expect(res.statusCode).toBe(204);
  });

  test("Returns 404", async () => {
    const {
      req,
      res,
    }: { req: NextApiRequest; res: MockResponse<NextApiResponse> } =
      createMocks({
        method: "DELETE",
        query: {
          id: "not exist",
        },
      });
    await handler(req, res);
    expect(res.statusCode).toBe(404);
  });
});
