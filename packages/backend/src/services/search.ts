import { Album, mapSpotifyAlbumToAlbum } from '../models/album';
import { Artist, mapSpotifyArtistToArtist } from '../models/artist';
import { Track, mapSpotifyTrackToTrack } from '../models/track';

import SpotifyClient from '../clients/spotify/spotify';

type SearchResult = {
  albums: Album[];
  artists: Artist[];
  tracks: Track[];
};

export default class SpotifySearchService {
  private spotifyClient: SpotifyClient;

  public constructor(spotifyClient: SpotifyClient) {
    this.spotifyClient = spotifyClient;
  }

  public search = async (
    query: string,
    types: string[],
    limit: number
  ): Promise<SearchResult> => {
    const searchResponse = await this.spotifyClient.search(query, types, {
      limit,
    });

    return {
      albums: searchResponse.albums
        ? searchResponse.albums.items.map(mapSpotifyAlbumToAlbum)
        : [],
      artists: searchResponse.artists
        ? searchResponse.artists.items.map(mapSpotifyArtistToArtist)
        : [],
      tracks: searchResponse.tracks
        ? searchResponse.tracks.items.map(mapSpotifyTrackToTrack)
        : [],
    };
  };

  public getArtistTopTracks = async (id: string): Promise<Track[]> => {
    const artistTopTracksResponse = await this.spotifyClient.getArtistTopTracks(
      id,
      'DE'
    );

    const tracks: Track[] = artistTopTracksResponse.tracks.map(
      mapSpotifyTrackToTrack
    );

    return tracks;
  };

  public getAlbumTracks = async (id: string): Promise<Track[]> => {
    const albumTracksResponse = await this.spotifyClient.getAlbumTracks(id, {
      limit: 50,
      market: 'DE',
    });

    const tracks: Track[] = albumTracksResponse.items.map(
      mapSpotifyTrackToTrack
    );

    return tracks;
  };
}
