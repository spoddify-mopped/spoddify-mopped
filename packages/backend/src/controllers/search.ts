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
  public path = '';
  public router = express.Router();

  private spotifySearchService: SpotifySearchService;

  public constructor(spotifySearchService: SpotifySearchService) {
    this.spotifySearchService = spotifySearchService;

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

    await this.spotifySearchService
      .search(query, type, limit)
      .then((result) => {
        response.send(result);
      })
      .catch(() => {
        response.sendStatus(503);
      });
  };

  private getArtistTopTracks = async (
    request: express.Request,
    response: express.Response
  ) => {
    const { params } = request;

    await this.spotifySearchService
      .getArtistTopTracks(params.id)
      .then((tracks) => {
        response.send({ tracks });
      })
      .catch(() => {
        response.sendStatus(503);
      });
  };

  private getAlbumTracks = async (
    request: express.Request,
    response: express.Response
  ) => {
    const { params } = request;

    await this.spotifySearchService
      .getAlbumTracks(params.id)
      .then((tracks) => {
        response.send({ tracks });
      })
      .catch(() => {
        response.sendStatus(503);
      });
  };
}
