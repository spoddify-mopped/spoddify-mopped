import {
  BaseArtist,
  Artist as SpotifyArtist,
} from '../clients/spotify/types/artist';

export type Artist = {
  id: string;
  name: string;
  imageUrl?: string;
};

export const mapSpotifyArtistToArtist = (
  spotifyArtist: SpotifyArtist
): Artist => {
  return {
    id: spotifyArtist.id,
    imageUrl: spotifyArtist.images?.[0]?.url,
    name: spotifyArtist.name,
  };
};

export const mapBaseSpotifyArtistToArtist = (
  spotifyArtist: BaseArtist
): Artist => {
  return {
    id: spotifyArtist.id,
    name: spotifyArtist.name,
  };
};

export const mapSpotifyArtistListToArtistList = (
  spotifyArtists: SpotifyArtist[]
): Artist[] => spotifyArtists.map(mapSpotifyArtistToArtist);
