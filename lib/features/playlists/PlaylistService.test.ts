import PlaylistService from "./PlaylistService";
import db, { seedVideos } from "../../data";
import { Playlist, Video } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

let testPlaylist: Playlist;
let testPlaylist2: Playlist;
let testVideo: Video;

beforeEach(async () => {
  testPlaylist = await db.playlist.create({
    data: {
      name: "Seeded Playlist 1",
    },
  });

  testPlaylist2 = await db.playlist.create({
    data: {
      name: "Seeded Playlist 2",
    },
  });

  testVideo = await db.video.create({
    data: {
      name: "seed 1",
      pinned: false,
      ytId: "124asasd12",
    },
  });

  await seedVideos();
});

afterEach(async () => {
  await db.video.deleteMany({});
  await db.playlist.deleteMany({});
});

async function addVideosToPlaylist() {
  const videos = await db.video.findMany({});
  for (let video of videos) {
    await db.videoPlaylist.create({
      data: {
        videoId: video.id,
        playlistId: testPlaylist.id,
      },
    });
  }
}

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
    await db.videoPlaylist.create({
      data: {
        playlistId: testPlaylist.id,
        videoId: testVideo.id,
      },
    });
    const found = await PlaylistService.getOneById(testPlaylist.id);
    expect(found).not.toBeNull();
    expect(found!.id).toStrictEqual(testPlaylist.id);
    expect(found!._count.videoPlaylist).toBe(1);
    expect(found!.createdAt).toStrictEqual(testPlaylist.createdAt);
    expect(found!.name).toStrictEqual(testPlaylist.name);
  });

  test("getAllVideos Finds all videos", async () => {
    const allVideos = await db.video.findMany({});
    for (let video of allVideos) {
      await db.videoPlaylist.create({
        data: {
          playlistId: testPlaylist.id,
          videoId: video.id,
        },
      });
    }

    const videos = await PlaylistService.getAllVideos(testPlaylist.id);
    expect(videos.length).toBe(allVideos.length);
    expect(videos[videos.length - 1].videoId).toBe(testVideo.id);
  });

  test("Delete one successfully", async () => {
    const deleted = await PlaylistService.deleteOne(testPlaylist.id);
    expect(deleted.id).toBe(testPlaylist.id);
  });

  test("Delete one should fail", async () => {
    await expect(PlaylistService.deleteOne("nonexistent")).rejects.toThrow();
  });

  test("Add video should succeed", async () => {
    const playlist = await PlaylistService.addVideo(
      testVideo.id,
      testPlaylist.id
    );
    const videos = await db.video.findMany({
      where: {
        videoPlaylist: {
          some: {
            playlistId: testPlaylist.id,
          },
        },
      },
    });

    expect(playlist).toBeTruthy();
    expect(videos.length).toBe(1);
  });

  test("Add nonexistent video should throw", async () => {
    await expect(
      PlaylistService.addVideo("nonexistent", testPlaylist.id)
    ).rejects.toThrow(PrismaClientKnownRequestError);
  });

  test("Add video to nonexistent playlist should throw", async () => {
    await expect(
      PlaylistService.addVideo(testVideo.id, "Nonexistent")
    ).rejects.toThrow(PrismaClientKnownRequestError);
  });

  test("Add duplicate video should throw", async () => {
    await PlaylistService.addVideo(testVideo.id, testPlaylist.id);

    await expect(
      PlaylistService.addVideo(testVideo.id, testPlaylist.id)
    ).rejects.toThrow();
  });

  test("Remove video should succeed", async () => {
    await addVideosToPlaylist();
    const originalLength = (
      await db.videoPlaylist.findMany({
        where: {
          playlistId: testPlaylist.id,
        },
      })
    ).length;

    const res = await PlaylistService.removeVideo(
      testVideo.id,
      testPlaylist.id
    );

    const newLength = (
      await db.videoPlaylist.findMany({
        where: {
          playlistId: testPlaylist.id,
        },
      })
    ).length;

    expect(newLength).toStrictEqual(originalLength - 1);
    expect(res.videoId).toBe(testVideo.id);
    expect(res.playlistId).toBe(testPlaylist.id);
  });

  test("Remove non added video should fail", async () => {
    await expect(
      PlaylistService.removeVideo(testVideo.id, testPlaylist.id)
    ).rejects.toThrow();
  });

  test("Remove from nonexistent playlist should fail", async () => {
    await expect(
      PlaylistService.removeVideo(testVideo.id, "None")
    ).rejects.toThrow();
  });

  test("Update name should succeed", async () => {
    await PlaylistService.update(testPlaylist.id, {
      name: "Updated Name 1",
    });
    const found = await db.playlist.findUnique({
      where: {
        id: testPlaylist.id,
      },
    });

    expect(found).toBeTruthy();
    expect(found!.name).toBe("Updated Name 1");
    expect(found!.createdAt).toStrictEqual(testPlaylist.createdAt);
  });

  describe("find", () => {
    test("Should find all", async () => {
      const found = await PlaylistService.find({});
      expect(found.length).toBe(2);
      // Make sure it's also in the right order by default sorting
      expect(found[0].name).toBe(testPlaylist2.name);
      expect(found[0].createdAt > found[1].createdAt).toBeTruthy();
    });

    test("Should limit size", async () => {
      const found = await PlaylistService.find({ size: 1 });
      expect(found.length).toBe(1);
    });

    test("Should order by createdAt asc", async () => {
      const found = await PlaylistService.find({
        orderBy: { createdAt: "asc" },
      });
      expect(found.length).toBe(2);
      expect(found[0].createdAt < found[1].createdAt).toBeTruthy();
    });

    test("Should order by name desc", async () => {
      const found = await PlaylistService.find({ orderBy: { name: "desc" } });
      expect(found[0].name).toBe(testPlaylist2.name);
      expect(found[1].name).toBe(testPlaylist.name);
    });

    test("Should order by name asc", async () => {
      const found = await PlaylistService.find({ orderBy: { name: "asc" } });
      expect(found[0].name).toBe(testPlaylist.name);
      expect(found[1].name).toBe(testPlaylist2.name);
    });

    test("Should start after cursor", async () => {
      const found = await PlaylistService.find({ cursor: testPlaylist2.id });
      expect(found.length).toBe(1);
      expect(found[0].name).toStrictEqual(testPlaylist.name);
    });
  });
});
