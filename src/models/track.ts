import { Album, mapSpotifyAlbumToAlbum } from './album';
import { Artist, mapSpotifyArtistListToArtistList } from './artist';

import { Track as SpotifyTrack } from '../clients/spotify/types/track';

export type Track = {
  id: string;
  name: string;
  artists: Artist[];
  album?: Album;
  imageUrl?: string;
  duration: number;
};

export const mapSpotifyTrackToTrack = (spotifyTrack: SpotifyTrack): Track => {
  return {
    album: spotifyTrack.album
      ? mapSpotifyAlbumToAlbum(spotifyTrack.album)
      : undefined,
    artists: mapSpotifyArtistListToArtistList(spotifyTrack.artists),
    duration: spotifyTrack.duration_ms,
    id: spotifyTrack.id,
    imageUrl: spotifyTrack.album
      ? spotifyTrack.album.images?.[0]?.url
      : undefined,
    name: spotifyTrack.name,
  };
};
