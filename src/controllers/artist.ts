import RequestError from '../error/request';
import { SpotifyApiError } from '../clients/spotify/error';
import SpotifySearchService from '../services/search';
import express from 'express';

export default class ArtistController {
  public path = '/artist';
  public router = express.Router();

  private spotifySearchService: SpotifySearchService;

  public constructor(spotifySearchService: SpotifySearchService) {
    this.spotifySearchService = spotifySearchService;

    this.initializeRoutes();
  }

  public initializeRoutes(): void {
    this.router.get(`${this.path}/:id`, this.getArtist);
    this.router.get(`${this.path}/:id/tracks`, this.getArtistTopTracks);
    this.router.get(`${this.path}/:id/albums`, this.getArtistsAlbums);
  }

  private getArtist = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const { params } = request;

    await this.spotifySearchService
      .getArtist(params.id)
      .then((artist) => {
        response.send(artist);
      })
      .catch((error) => {
        if (error instanceof SpotifyApiError) {
          next(RequestError.fromSpotifyApiError(error));
        } else {
          next(error);
        }
      });
  };

  private getArtistTopTracks = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const { params } = request;

    await this.spotifySearchService
      .getArtistTopTracks(params.id)
      .then((tracks) => {
        response.send({ tracks });
      })
      .catch((error) => {
        if (error instanceof SpotifyApiError) {
          next(RequestError.fromSpotifyApiError(error));
        } else {
          next(error);
        }
      });
  };

  private getArtistsAlbums = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const { params } = request;

    const limit =
      Number.parseInt(request.query['limit'] as string) || undefined;

    await this.spotifySearchService
      .getArtistAlbums(params.id, limit)
      .then((albums) => {
        response.send({ albums });
      })
      .catch((error) => {
        if (error instanceof SpotifyApiError) {
          next(RequestError.fromSpotifyApiError(error));
        } else {
          next(error);
        }
      });
  };
}
