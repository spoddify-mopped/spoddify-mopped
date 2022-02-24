import { Artist, mapSpotifyArtistListToArtistList } from './artist';
import { Track, mapSpotifyTrackToTrack } from './track';

import { Album as SpotifyAlbum } from '../clients/spotify/types/album';

export type Album = {
  id: string;
  name: string;
  artists: Artist[];
  imageUrl?: string;
  releaseDate: string;
};

export type AlbumWithTracks = Album & {
  tracks: Track[];
};

export const mapSpotifyAlbumToAlbum = (spotifyAlbum: SpotifyAlbum): Album => {
  return {
    artists: mapSpotifyArtistListToArtistList(spotifyAlbum.artists),
    id: spotifyAlbum.id,
    imageUrl: spotifyAlbum.images?.[0]?.url,
    name: spotifyAlbum.name,
    releaseDate: spotifyAlbum.release_date,
  };
};

export const mapSpotifyAlbumToAlbumWithTracks = (
  spotifyAlbum: SpotifyAlbum
): AlbumWithTracks => {
  return {
    artists: mapSpotifyArtistListToArtistList(spotifyAlbum.artists),
    id: spotifyAlbum.id,
    imageUrl: spotifyAlbum.images?.[0]?.url,
    name: spotifyAlbum.name,
    releaseDate: spotifyAlbum.release_date,
    tracks: spotifyAlbum.tracks.items.map(mapSpotifyTrackToTrack),
  };
};
