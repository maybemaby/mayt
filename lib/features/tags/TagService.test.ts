import { Tag } from "@prisma/client";
import db, { seedVideos } from "../../data";
import TagService from "./TagService";

let testTag: Tag;
let testTag2: Tag;

beforeEach(async () => {
  testTag = await db.tag.create({
    data: {
      name: "Test tag 1",
    },
  });

  testTag2 = await db.tag.create({
    data: {
      name: "Test tag 1",
    },
  });

  await seedVideos();
});

afterEach(async () => {
  await db.video.deleteMany({});
  await db.tag.deleteMany({});
});

describe("PlaylistService", () => {
  test("Create one success", async () => {
    const res = await TagService.createTag("Created one");
    expect(res.name).toBe("Created one");
    expect(res.id).toBeTruthy();
    expect(res.typeId).toBeFalsy();
  });

  test("Find all success", async () => {
    const res = await TagService.findTags({});

    expect(res.length).toBe(2);
    expect(res[0].id).toBe(testTag.id);
    expect(res[1].id).toBe(testTag2.id);
  });

  test("Should find none for video", async () => {
    const vid = await db.video.findFirst({});
    const res = await TagService.findTags({ videoId: vid?.id });
    expect(vid).toBeTruthy();
    expect(res.length).toBe(0);
  });

  test("Delete one success", async () => {
    const res = await TagService.deleteTag(testTag.id);
    expect(res.id).toBe(testTag.id);
  });

  test("Delete one fail", async () => {
    await expect(TagService.deleteTag("none")).rejects.toThrow();
  });
});
