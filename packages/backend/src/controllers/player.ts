import SpotifyPlayerService from '../services/player';
import express from 'express';

export default class PlayerController {
  public path = '/player';
  public router = express.Router();

  private spotifyPlayerService: SpotifyPlayerService;

  public constructor(spotifyPlayerService: SpotifyPlayerService) {
    this.spotifyPlayerService = spotifyPlayerService;

    this.initializeRoutes();
  }

  public initializeRoutes(): void {
    this.router.get(`${this.path}`, this.getPlayer);
    this.router.post(`${this.path}/pause`, this.playPause);
    this.router.post(`${this.path}/forwards`, this.next);
    this.router.post(`${this.path}/previous`, this.previous);
    this.router.put(`${this.path}/seek`, this.seek);
    this.router.put(`${this.path}/volume`, this.setVolume);
    this.router.post(`${this.path}/play`, this.play);
    this.router.post(`${this.path}/queue`, this.addQueue);
  }

  private getPlayer = async (
    _request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ): Promise<void> => {
    await this.spotifyPlayerService
      .getPlayer()
      .then((player) => response.send(player))
      .catch((err) => next(err));
  };

  private playPause = async (
    _request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ): Promise<void> => {
    await this.spotifyPlayerService
      .playPause()
      .then(() => response.sendStatus(204))
      .catch((err) => next(err));
  };

  private next = async (
    _request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ): Promise<void> => {
    await this.spotifyPlayerService
      .next()
      .then(() => response.sendStatus(204))
      .catch((err) => next(err));
  };

  private previous = async (
    _request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ): Promise<void> => {
    await this.spotifyPlayerService
      .previous()
      .then(() => response.sendStatus(204))
      .catch((err) => next(err));
  };

  private seek = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ): Promise<void> => {
    const position = request.query['position'] as string;

    if (!position) {
      response.sendStatus(400);
      return;
    }

    await this.spotifyPlayerService
      .seek(Number.parseInt(position))
      .then(() => response.sendStatus(204))
      .catch((err) => next(err));
  };

  private setVolume = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ): Promise<void> => {
    const volumeString = request.query['volume'] as string;

    if (!volumeString) {
      response.sendStatus(400);
      return;
    }

    const volume = Number.parseInt(volumeString);
    if (volume < 0 || volume > 100) {
      response.sendStatus(400);
      return;
    }

    await this.spotifyPlayerService
      .setVolume(volume)
      .then(() => response.sendStatus(204))
      .catch((err) => next(err));
  };

  private play = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ): Promise<void> => {
    let uris = request.query['uri'] as string | string[];

    if (!uris) {
      uris = [];
    }

    if (!Array.isArray(uris)) {
      uris = [uris];
    }

    await this.spotifyPlayerService
      .play(uris)
      .then(() => response.sendStatus(204))
      .catch((err) => next(err));
  };

  private addQueue = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ): Promise<void> => {
    const uri = request.query['uri'] as string;

    if (!uri) {
      response.sendStatus(400);
      return;
    }

    await this.spotifyPlayerService
      .addQueue(uri)
      .then(() => response.sendStatus(204))
      .catch((err) => next(err));
  };
}
