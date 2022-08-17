import VideoService from "./VideoService";
import db from "../../data";
import { Tag } from "@prisma/client";

let happy: Tag;
let sad: Tag;
let lazy: Tag;

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
});

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
        ytId: "124asasd12",
      },
      {
        name: "seed 2",
        pinned: false,
        addedAt: middle,
        ytId: "124asasda2",
      },
      {
        name: "seed 3",
        pinned: false,
        addedAt: earliest,
        ytId: "124asasd2f",
      },
    ],
  });

  const video1 = (
    await db.video.findFirst({
      where: {
        name: { contains: "seed 1" },
      },
    })
  )?.id;

  const video2 = (
    await db.video.findFirst({
      where: {
        name: { contains: "seed 2" },
      },
    })
  )?.id;

  await db.videoTag.createMany({
    data: [
      {
        tagId: happy.id,
        videoId: video1 as string,
      },
      {
        tagId: sad.id,
        videoId: video1 as string,
      },
      {
        tagId: lazy.id,
        videoId: video2 as string,
      },
    ],
  });
});

afterEach(async () => {
  await db.video.deleteMany({});
});

afterAll(async () => {
  await db.tag.deleteMany({});
  await db.tagType.deleteMany({});
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
      channel: {
        name: "channelCreate",
        url: "https://youtube.com/channelCreate",
      },
    });

    const channel = await db.channel.findUnique({
      where: {
        name: "channelCreate",
      },
    });

    expect(res).toBeTruthy();
    expect(channel).toBeTruthy();
    expect(res.length).toBe(2000);
    expect(res.pinned).toBe(false);
    expect(res.name).toBe("test.mp4");
    expect(res.channelId).toBeTruthy();
    expect(res.channel).toHaveProperty("url");
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

  test("Should return tagged", async () => {
    const found = await VideoService.findVideos({ matchingTags: ["happy"] });
    const foundAll = await VideoService.findVideos({
      matchingTags: ["happy", "sad", "lazy"],
    });
    expect(found.length).toBe(1);
    expect(found[0].name).toBe("seed 1");
    expect(foundAll.length).toBe(2);
    expect(foundAll[0].addedAt > foundAll[1].addedAt).toBeTruthy();
  });

  test("Should not return untagged", async () => {
    const found = await VideoService.findVideos({
      matchingTags: ["nonexistent"],
    });

    expect(found.length).toBe(0);
  });

  test("Should add tag", async () => {
    const created = await db.video.create({
      data: {
        name: "Attach Tag",
        pinned: false,
        ytId: "testattach12as",
      },
    });

    await VideoService.addTag(created.id, happy.id);

    const video = await db.video.findUnique({
      where: {
        id: created.id,
      },
      include: {
        VideoTag: {
          include: {
            tag: true,
          },
        },
      },
    });

    expect(video?.VideoTag[0].tag.name).toBe("happy");
  });

  test("Should return only pinned", async () => {
    const pinned = await db.video.create({
      data: {
        name: "Pinned Video",
        pinned: true,
        ytId: "Asad12312",
      },
    });

    const res = await VideoService.getPinned(10);

    expect(res.length).toBe(1);
    expect(res[0].name).toBe("Pinned Video");
    expect(res[0].pinned).toBe(true);
  });

  test("Should toggle pinned", async () => {
    const unpinned = await db.video.create({
      data: {
        name: "unpinned Video",
        pinned: true,
        ytId: "Asad12312",
      },
    });

    const res = await VideoService.togglePinned(unpinned.id);

    expect(res.pinned).toBeFalsy();
  });
});
