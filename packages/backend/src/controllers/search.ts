import SpotifySearchService from '../services/search';
import express from 'express';

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
  public path = '/search';
  public router = express.Router();

  private spotifySearchService: SpotifySearchService;

  public constructor(spotifySearchService: SpotifySearchService) {
    this.spotifySearchService = spotifySearchService;

    this.initializeRoutes();
  }

  public initializeRoutes(): void {
    this.router.get(`${this.path}`, this.search);
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

    await this.spotifySearchService
      .search(query, type, limit)
      .then((result) => {
        response.send(result);
      })
      .catch(() => {
        response.sendStatus(503);
      });
  };
}
