import SpotifyPlayerService, { DeviceNotFoundError } from '../services/player';

import express from 'express';

export default class PlayerController {
  public path = '';
  public router = express.Router();

  private spotifyPlayerService: SpotifyPlayerService;

  public constructor(spotifyPlayerService: SpotifyPlayerService) {
    this.spotifyPlayerService = spotifyPlayerService;

    this.initializeRoutes();
  }

  public initializeRoutes(): void {
    this.router.get(`${this.path}/player`, this.getPlayer);
    this.router.post(`${this.path}/pause`, this.playPause);
    this.router.post(`${this.path}/forwards`, this.next);
    this.router.post(`${this.path}/previous`, this.previous);
    this.router.put(`${this.path}/seek`, this.seek);
    this.router.post(`${this.path}/play`, this.play);
    this.router.post(`${this.path}/queue`, this.addQueue);
  }

  private handleError = (error: Error, response: express.Response) => {
    if (error instanceof DeviceNotFoundError) {
      response.status(503).send({
        msg: 'Player not found',
      });
    } else {
      response.status(503).send({
        msg: 'Internal Server Error',
      });
    }
  };

  private getPlayer = async (
    _request: express.Request,
    response: express.Response
  ): Promise<void> => {
    await this.spotifyPlayerService
      .getPlayer()
      .then((player) => response.send(player))
      .catch((error) => this.handleError(error, response));
  };

  private playPause = async (
    _request: express.Request,
    response: express.Response
  ): Promise<void> => {
    await this.spotifyPlayerService
      .playPause()
      .then(() => response.sendStatus(204))
      .catch((error) => this.handleError(error, response));
  };

  private next = async (
    _request: express.Request,
    response: express.Response
  ): Promise<void> => {
    await this.spotifyPlayerService
      .next()
      .then(() => response.sendStatus(204))
      .catch((error) => this.handleError(error, response));
  };

  private previous = async (
    _request: express.Request,
    response: express.Response
  ): Promise<void> => {
    await this.spotifyPlayerService
      .previous()
      .then(() => response.sendStatus(204))
      .catch((error) => this.handleError(error, response));
  };

  private seek = async (
    request: express.Request,
    response: express.Response
  ): Promise<void> => {
    const position = request.query['position'] as string;

    if (!position) {
      response.sendStatus(400);
      return;
    }

    await this.spotifyPlayerService
      .seek(Number.parseInt(position))
      .then(() => response.sendStatus(204))
      .catch((error) => this.handleError(error, response));
  };

  private play = async (
    request: express.Request,
    response: express.Response
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
      .catch((error) => this.handleError(error, response));
  };

  private addQueue = async (
    request: express.Request,
    response: express.Response
  ): Promise<void> => {
    const uri = request.query['uri'] as string;

    if (!uri) {
      response.sendStatus(400);
      return;
    }

    await this.spotifyPlayerService
      .addQueue(uri)
      .then(() => response.sendStatus(204))
      .catch((error) => this.handleError(error, response));
  };
}
