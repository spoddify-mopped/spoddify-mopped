import {
  Album,
  Artist,
  Track,
  spotifyResponseMapper,
} from '../utils/spotifyResponseMapper';

import express from 'express';
import { spotifyApi } from './../index';

type SearchResponse = {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
};

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
    this.router.get(`${this.path}/artist/:id/tracks`, this.getArtistTopTracks);
    this.router.get(`${this.path}/album/:id/tracks`, this.getAlbumTracks);
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
        ? spotifyRes.body.albums.items.map(spotifyResponseMapper.mapToAlbum)
        : [],
      artists: spotifyRes.body.artists
        ? spotifyRes.body.artists.items.map(spotifyResponseMapper.mapToArtist)
        : [],
      tracks: spotifyRes.body.tracks
        ? spotifyRes.body.tracks.items.map(spotifyResponseMapper.mapToTrack)
        : [],
    };

    response.send(searchResponse);
  };

  private getArtistTopTracks = async (
    request: express.Request,
    response: express.Response
  ) => {
    const { params } = request;

    const artistTopTracksResponse = await spotifyApi.getArtistTopTracks(
      params.id,
      'DE'
    );

    const tracks: Track[] = artistTopTracksResponse.body.tracks.map(
      spotifyResponseMapper.mapToTrack
    );

    response.send({ tracks });
  };

  private getAlbumTracks = async (
    request: express.Request,
    response: express.Response
  ) => {
    const { params } = request;

    const albumTracksResponse = await spotifyApi.getAlbumTracks(params.id, {
      limit: 50,
    });

    const tracks: Track[] = albumTracksResponse.body.items.map(
      spotifyResponseMapper.mapToTrack
    );

    response.send({ tracks });
  };
}
