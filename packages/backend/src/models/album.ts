import { Artist, mapSpotifyArtistListToArtistList } from './artist';
import { Track, mapSpotifyTrackToTrack } from './track';

import { Album as SpotifyAlbum } from '../clients/spotify/types/album';

export type Album = {
  id: string;
  name: string;
  artists: Artist[];
  imageUrl?: string;
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
    tracks: spotifyAlbum.tracks.items.map(mapSpotifyTrackToTrack),
  };
};
