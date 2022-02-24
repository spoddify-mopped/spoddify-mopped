import {
  Album,
  AlbumWithTracks,
  mapSpotifyAlbumToAlbum,
  mapSpotifyAlbumToAlbumWithTracks,
} from '../models/album';
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

  public getArtistAlbums = async (
    id: string,
    limit?: number
  ): Promise<Album[]> => {
    const artistTopTracksResponse = await this.spotifyClient.getArtistsAlbums(
      id
    );

    artistTopTracksResponse.items = artistTopTracksResponse.items
      .filter(
        (value, index, self) =>
          index === self.findIndex((t) => t.name === value.name)
      )
      .slice(0, limit);

    const album: Album[] = artistTopTracksResponse.items.map(
      mapSpotifyAlbumToAlbum
    );

    return album;
  };

  public getArtist = async (id: string): Promise<Artist> => {
    const artistResponse = await this.spotifyClient.getArtist(id);
    return mapSpotifyArtistToArtist(artistResponse);
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

  public getAlbum = async (id: string): Promise<AlbumWithTracks> => {
    const albumResponse = await this.spotifyClient.getAlbum(id, {
      market: 'DE',
    });

    return mapSpotifyAlbumToAlbumWithTracks(albumResponse);
  };
}
