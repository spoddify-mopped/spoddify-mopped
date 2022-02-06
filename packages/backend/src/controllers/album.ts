import SpotifySearchService from '../services/search';
import express from 'express';

export default class AlbumController {
  public path = '/album';
  public router = express.Router();

  private spotifySearchService: SpotifySearchService;

  public constructor(spotifySearchService: SpotifySearchService) {
    this.spotifySearchService = spotifySearchService;

    this.initializeRoutes();
  }

  public initializeRoutes(): void {
    this.router.get(`${this.path}/:id/tracks`, this.getAlbumTracks);
  }

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
