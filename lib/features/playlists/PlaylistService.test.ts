import PlaylistService from "./PlaylistService";
import db from "../../data";
import { Playlist } from "@prisma/client";

let testPlaylist: Playlist;

beforeEach(async () => {
  testPlaylist = await db.playlist.create({
    data: {
      name: "Seeded Playlist 1",
    },
  });
});

afterEach(async () => {
  await db.video.deleteMany({});
  await db.playlist.deleteMany({});
});

describe("PlaylistService", () => {
  test("Successfully create", async () => {
    const created = await PlaylistService.createPlaylist({
      name: "Created Playlist",
    });
    expect(created.createdAt).toBeTruthy();
    expect(created.createdAt < new Date()).toBeTruthy();
    expect(created.id).toBeTruthy();
    expect(created.name).toBe("Created Playlist");
  });

  test("getOneById returns null", async () => {
    const found = await PlaylistService.getOneById("Nonexsitent");
    expect(found).toBeNull();
  });

  test("getOneById finds one", async () => {
    const found = await PlaylistService.getOneById(testPlaylist.id);
    expect(found).not.toBeNull();
    expect(found!.id).toStrictEqual(testPlaylist.id);
    expect(found!.createdAt).toStrictEqual(testPlaylist.createdAt);
    expect(found!.name).toStrictEqual(testPlaylist.name);
  });

  test("Delete one successfully", async () => {
    const deleted = await PlaylistService.deleteOne(testPlaylist.id);
    expect(deleted.id).toBe(testPlaylist.id);
  });

  test("Delete one should fail", async () => {
    await expect(PlaylistService.deleteOne("nonexistent")).rejects.toThrow();
  });
});
