import express from 'express';
import { spotifyApi } from './../index';

type SpotifySearchType =
  | 'album'
  | 'artist'
  | 'playlist'
  | 'track'
  | 'show'
  | 'episode';

const spotifySearchTypeList = [
  'album',
  'artist',
  'playlist',
  'track',
  'show',
  'episode',
];

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

    const spotifyRes = await spotifyApi.search(query, type);

    response.send(spotifyRes.body);
  };
}
