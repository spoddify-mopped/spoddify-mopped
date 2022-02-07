export type SystemStatus = {
  ready: boolean;
};

export type Artist = {
  id: string;
  name: string;
  imageUrl?: string;
};

export type Album = {
  id: string;
  name: string;
  artists: Artist[];
  imageUrl?: string;
};

export type AlbumWithTracks = Album & {
  tracks: Track[];
};

export type Track = {
  id: string;
  name: string;
  artists: Artist[];
  album: Album;
  imageUrl?: string;
};

export type SearchResponse = {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
};

export type ArtistTopTracksResponse = {
  tracks: Track[];
};

export type ArtistsAlbumsResponse = {
  albums: Album[];
};

export type Playlist = {
  id: number;
  name: string;
};

export type FullPlaylist = Playlist & {
  tracks: Track[];
};
