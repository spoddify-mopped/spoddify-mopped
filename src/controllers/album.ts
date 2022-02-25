import RequestError from '../error/request';
import { SpotifyApiError } from '../clients/spotify/error';
import SpotifySearchService from '../services/search';
import express from 'express';

export default class AlbumController {
  public path = '/album';
  public router = express.Router();

  public constructor(
    private readonly spotifySearchService: SpotifySearchService
  ) {
    this.initializeRoutes();
  }

  public initializeRoutes(): void {
    this.router.get(`${this.path}/:id`, this.getAlbum);
    this.router.get(`${this.path}/:id/tracks`, this.getAlbumTracks);
  }

  private getAlbum = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const { params } = request;

    await this.spotifySearchService
      .getAlbum(params.id)
      .then((album) => {
        response.send(album);
      })
      .catch((error) => {
        if (error instanceof SpotifyApiError) {
          next(RequestError.fromSpotifyApiError(error));
        } else {
          next(error);
        }
      });
  };

  private getAlbumTracks = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const { params } = request;

    await this.spotifySearchService
      .getAlbumTracks(params.id)
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
}
