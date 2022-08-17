export type PlaylistLike = {
  id: string;
  name: string;
  createdAt: Date;
  _count: {
    videoPlaylist: number;
  };
  videoPlaylist: {
    videoId: string;
    playlistId: string;
    addedAt: Date;
    video: {
      id: string;
      name: string;
      thumbnail_url: string | null;
    };
  }[];
};