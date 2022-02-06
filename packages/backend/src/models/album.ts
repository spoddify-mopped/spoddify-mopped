import { Artist, mapSpotifyArtistListToArtistList } from './artist';

import { Album as SpotifyAlbum } from '../clients/spotify/types/album';

export type Album = {
  id: string;
  name: string;
  artists: Artist[];
  imageUrl?: string;
};

export const mapSpotifyAlbumToAlbum = (spotifyAlbum: SpotifyAlbum): Album => {
  return {
    artists: mapSpotifyArtistListToArtistList(spotifyAlbum.artists),
    id: spotifyAlbum.id,
    imageUrl: spotifyAlbum.images?.[0]?.url,
    name: spotifyAlbum.name,
  };
};
