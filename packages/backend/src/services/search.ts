import {
  Album as SpotifyAlbum,
  FullArtist as SpotifyArtist,
  Track as SpotifyTrack,
} from '../clients/spotify/responses';

import SpotifyClient from '../clients/spotify/spotify';

type Artist = {
  id: string;
  name: string;
  imageUrl?: string;
};

type Album = {
  id: string;
  name: string;
  artists: Artist[];
  imageUrl?: string;
};

type Track = {
  id: string;
  name: string;
  artists: Artist[];
  album?: Album;
  imageUrl?: string;
};

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

  private mapSpotifyArtistToArtist = (spotifyArtist: SpotifyArtist) => {
    return {
      id: spotifyArtist.id,
      imageUrl: spotifyArtist.images?.[0]?.url,
      name: spotifyArtist.name,
    };
  };

  private mapSpotifyAlbumToAlbum = (spotifyAlbum: SpotifyAlbum) => {
    return {
      artists: spotifyAlbum.artists.map(this.mapSpotifyArtistToArtist),
      id: spotifyAlbum.id,
      imageUrl: spotifyAlbum.images?.[0]?.url,
      name: spotifyAlbum.name,
    };
  };

  private mapSpotifyTrackToTrack = (spotifyTrack: SpotifyTrack) => {
    return {
      album: spotifyTrack.album
        ? this.mapSpotifyAlbumToAlbum(spotifyTrack.album)
        : undefined,
      artists: spotifyTrack.artists.map(this.mapSpotifyArtistToArtist),
      id: spotifyTrack.id,
      imageUrl: spotifyTrack.album
        ? spotifyTrack.album.images?.[0].url
        : undefined,
      name: spotifyTrack.name,
    };
  };

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
        ? searchResponse.albums.items.map(this.mapSpotifyAlbumToAlbum)
        : [],
      artists: searchResponse.artists
        ? searchResponse.artists.items.map(this.mapSpotifyArtistToArtist)
        : [],
      tracks: searchResponse.tracks
        ? searchResponse.tracks.items.map(this.mapSpotifyTrackToTrack)
        : [],
    };
  };

  public getArtistTopTracks = async (id: string): Promise<Track[]> => {
    const artistTopTracksResponse = await this.spotifyClient.getArtistTopTracks(
      id,
      'DE'
    );

    const tracks: Track[] = artistTopTracksResponse.tracks.map(
      this.mapSpotifyTrackToTrack
    );

    return tracks;
  };

  public getAlbumTracks = async (id: string): Promise<Track[]> => {
    const albumTracksResponse = await this.spotifyClient.getAlbumTracks(id, {
      limit: 50,
      market: 'DE',
    });

    const tracks: Track[] = albumTracksResponse.items.map(
      this.mapSpotifyTrackToTrack
    );

    return tracks;
  };
}
