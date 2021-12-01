import express from 'express';
import { spotifyApi } from './../index';

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
  album: Album;
  imageUrl?: string;
};

type SearchResponse = {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
};

const mapSpotifyArtistToArtist = (
  spotifyArtist: SpotifyApi.ArtistObjectFull
): Artist => ({
  id: spotifyArtist.id,
  imageUrl: spotifyArtist.images?.[0]?.url,
  name: spotifyArtist.name,
});

const mapSpotifyAlbumToAlbum = (
  spotifyAlbum: SpotifyApi.AlbumObjectFull
): Album => ({
  artists: spotifyAlbum.artists.map(mapSpotifyArtistToArtist),
  id: spotifyAlbum.id,
  imageUrl: spotifyAlbum.images?.[0]?.url,
  name: spotifyAlbum.name,
});

const mapSpotifyTrackToTrack = (
  spotifyTrack: SpotifyApi.TrackObjectFull
): Track => ({
  album: mapSpotifyAlbumToAlbum(
    spotifyTrack.album as SpotifyApi.AlbumObjectFull
  ),
  artists: spotifyTrack.artists.map(mapSpotifyArtistToArtist),
  id: spotifyTrack.id,
  imageUrl: spotifyTrack.album.images?.[0].url,
  name: spotifyTrack.name,
});

type SpotifySearchType = 'album' | 'artist' | 'track';

const spotifySearchTypeList = ['album', 'artist', 'track'];

const isOfSpotifySearchType = (type: string): type is SpotifySearchType =>
  spotifySearchTypeList.includes(type);

const isOfSpotifySearchTypeList = (
  types: string[]
): types is SpotifySearchType[] => {
  for (const type of types) {
    if (!isOfSpotifySearchType(type)) {
      return false;
    }
  }
  return true;
};

export default class SearchController {
  public path = '';
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes(): void {
    this.router.get(`${this.path}/search`, this.search);
  }

  private search = async (
    request: express.Request,
    response: express.Response
  ): Promise<void> => {
    const query = request.query['query'] as string;
    let type = request.query['type'] as string | string[];
    const limit =
      Number.parseInt(request.query['limit'] as string) || undefined;

    if (!Array.isArray(type)) {
      type = [type];
    }

    if (!isOfSpotifySearchTypeList(type)) {
      response.sendStatus(400);
      return;
    }

    if (!query) {
      response.sendStatus(400);
      return;
    }

    const spotifyRes = await spotifyApi.search(query, type, {
      limit,
    });

    const searchResponse: SearchResponse = {
      albums: spotifyRes.body.albums
        ? spotifyRes.body.albums.items.map(mapSpotifyAlbumToAlbum)
        : [],
      artists: spotifyRes.body.artists
        ? spotifyRes.body.artists.items.map(mapSpotifyArtistToArtist)
        : [],
      tracks: spotifyRes.body.tracks
        ? spotifyRes.body.tracks.items.map(mapSpotifyTrackToTrack)
        : [],
    };

    response.send(searchResponse);
  };
}
