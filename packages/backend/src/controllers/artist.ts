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
  }

  private getArtist = async (
    request: express.Request,
    response: express.Response
  ) => {
    const { params } = request;

    await this.spotifySearchService
      .getArtist(params.id)
      .then((artist) => {
        response.send(artist);
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
}
