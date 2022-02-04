import {
  Album as SpotifyAlbum,
  FullArtist as SpotifyArtist,
  Track as SpotifyTrack,
} from './../clients/spotify/spotify_response';

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

export type Track = {
  id: string;
  name: string;
  artists: Artist[];
  album?: Album;
  imageUrl?: string;
};

export const spotifyResponseMapper = {
  mapToAlbum: (spotifyAlbum: SpotifyAlbum): Album => ({
    artists: spotifyAlbum.artists.map(spotifyResponseMapper.mapToArtist),
    id: spotifyAlbum.id,
    imageUrl: spotifyAlbum.images?.[0]?.url,
    name: spotifyAlbum.name,
  }),
  mapToArtist: (spotifyArtist: SpotifyArtist): Artist => ({
    id: spotifyArtist.id,
    imageUrl: spotifyArtist.images?.[0]?.url,
    name: spotifyArtist.name,
  }),
  mapToTrack: (spotifyTrack: SpotifyTrack): Track => ({
    album: spotifyTrack.album
      ? spotifyResponseMapper.mapToAlbum(spotifyTrack.album)
      : undefined,
    artists: spotifyTrack.artists.map(spotifyResponseMapper.mapToArtist),
    id: spotifyTrack.id,
    imageUrl: spotifyTrack.album
      ? spotifyTrack.album.images?.[0].url
      : undefined,
    name: spotifyTrack.name,
  }),
};
