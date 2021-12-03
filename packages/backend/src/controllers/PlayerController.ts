import { DeviceNotFoundError } from '../services/SpotifyPlayerService';
import express from 'express';
import { spotifyPlayerService } from './../index';

export default class PlayerController {
  public path = '';
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes(): void {
    this.router.get(`${this.path}/player`, this.getPlayer);
    this.router.post(`${this.path}/pause`, this.playPause);
    this.router.post(`${this.path}/forwards`, this.next);
    this.router.post(`${this.path}/previous`, this.previous);
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
    await spotifyPlayerService
      .getPlayer()
      .then((player) => response.send(player))
      .catch((error) => this.handleError(error, response));
  };

  private playPause = async (
    _request: express.Request,
    response: express.Response
  ): Promise<void> => {
    await spotifyPlayerService
      .playPause()
      .then(() => response.sendStatus(204))
      .catch((error) => this.handleError(error, response));
  };

  private next = async (
    _request: express.Request,
    response: express.Response
  ): Promise<void> => {
    await spotifyPlayerService
      .next()
      .then(() => response.sendStatus(204))
      .catch((error) => this.handleError(error, response));
  };

  private previous = async (
    _request: express.Request,
    response: express.Response
  ): Promise<void> => {
    await spotifyPlayerService
      .previous()
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

    await spotifyPlayerService
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

    await spotifyPlayerService
      .addQueue(uri)
      .then(() => response.sendStatus(204))
      .catch((error) => this.handleError(error, response));
  };
}
