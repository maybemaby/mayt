import VideoService from "./VideoService";
import db from "../../data";

beforeEach(async () => {
  const latest = new Date();
  latest.setFullYear(2022);
  const middle = new Date();
  middle.setFullYear(2020);
  const earliest = new Date();
  earliest.setFullYear(2000);

  await db.video.createMany({
    data: [
      {
        name: "seed 1",
        pinned: false,
        addedAt: latest,
        ytId: "124asasd2",
      },
      {
        name: "seed 2",
        pinned: false,
        addedAt: middle,
        ytId: "124asasd2",
      },
      {
        name: "seed 3",
        pinned: false,
        addedAt: earliest,
        ytId: "124asasd2",
      },
    ],
  });
});

afterEach(async () => {
  await db.video.deleteMany({});
});

describe("VideoService", () => {
  test("Should create", async () => {
    const res = await VideoService.createVideo({
      length: 2000,
      name: "test.mp4",
      pinned: false,
      ytId: "12asf1231a",
      channelId: undefined,
      thumbnailUrl: undefined,
      thumbnailHeight: undefined,
      thumbnailWidth: undefined,
    });

    expect(res).toBeTruthy();
    expect(res.length).toBe(2000);
    expect(res.pinned).toBe(false);
    expect(res.name).toBe("test.mp4");
    expect(res.channelId).toBe(null);
    expect(res.channel).toBe(null);
  });

  test("Should delete", async () => {
    const created = await db.video.create({
      data: {
        name: "test delete",
        pinned: false,
        ytId: "12safa12",
      },
    });
    const res = await VideoService.deleteVideo(created.id);

    expect(res).toBeTruthy();
    expect(res.name).toBe("test delete");
  });

  test("Should find all", async () => {
    const found = await VideoService.findVideos({});

    expect(found.length).toBe(3);
    expect(found[0].addedAt > found[1].addedAt).toBeTruthy();
  });

  test("Should order asc", async () => {
    const found = await VideoService.findVideos({
      orderBy: {
        addedAt: "asc",
      },
    });

    expect(found[0].addedAt < found[1].addedAt).toBeTruthy();
  });

  test("Should return none", async () => {
    const found = await VideoService.findVideos({
      channelId: "testNone",
    });
    expect(found.length).toBe(0);
  });

  test("Should limit to one", async () => {
    const found = await VideoService.findVideos({
      size: 1,
    });

    expect(found.length).toBe(1);
  });
});
