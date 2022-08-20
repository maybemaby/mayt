export interface VideoLike {
  id: string;
  name: string;
  channel: {
    id: string;
    name: string;
  } | null;
  thumbnail_url: string | null;
  pinned: boolean | null;
  videoPlaylist: {
    videoId: string;
    playlistId: string;
  }[];
}
