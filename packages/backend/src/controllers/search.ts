import { matchedData, query } from 'express-validator';

import RequestError from '../error/request';
import SpotifySearchService from '../services/search';
import express from 'express';

const searchTypes = ['album', 'artist', 'track'];

const isType = (type: string): boolean => searchTypes.includes(type);
const isTypeList = (types: string[]): boolean => {
  for (const type of types) {
    if (!isType(type)) {
      return false;
    }
  }
  return true;
};

type SearchQuery = {
  query: string;
  limit?: number;
  type: string[];
};

const typeValidator = (type) => {
  if (typeof type === 'string') {
    return isType(type);
  }

  if (Array.isArray(type)) {
    return isTypeList(type);
  }
};

const searchValidationChain = [
  query('query').isString(),
  query('limit').optional().isNumeric().toInt(),
  query('type').custom(typeValidator).toArray(),
];

export default class SearchController {
  public path = '/search';
  public router = express.Router();

  private spotifySearchService: SpotifySearchService;

  public constructor(spotifySearchService: SpotifySearchService) {
    this.spotifySearchService = spotifySearchService;

    this.initializeRoutes();
  }

  public initializeRoutes(): void {
    this.router.get(`${this.path}`, searchValidationChain, this.search);
  }

  private search = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ): Promise<void> => {
    const validationError = RequestError.validationResult(request);
    if (validationError) {
      next(validationError);
      return;
    }

    const data = matchedData(request, {
      includeOptionals: true,
    }) as SearchQuery;

    await this.spotifySearchService
      .search(data.query, data.type, data.limit)
      .then((result) => {
        response.send(result);
      })
      .catch(() => {
        response.sendStatus(503);
      });
  };
}
