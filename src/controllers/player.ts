import Player, { DeviceNotFoundError } from '../player/player';
import { matchedData, query } from 'express-validator';

import RequestError from '../error/request';
import { SpotifyApiError } from '../clients/spotify/error';
import { StatusCodes } from 'http-status-codes';
import express from 'express';

type SeekQuery = {
  position: number;
};

type VolumeQuery = {
  volume: number;
};

type PlayQuery = {
  uri: string[];
};

type AddQueueQuery = {
  uri: string;
};

export default class PlayerController {
  public path = '/player';
  public router = express.Router();

  public constructor(private readonly player: Player) {
    this.initializeRoutes();
  }

  public initializeRoutes(): void {
    this.router.get(`${this.path}`, this.getPlayer);
    this.router.get(`${this.path}/queue`, this.getQueue);
    this.router.post(`${this.path}/pause`, this.playPause);
    this.router.post(`${this.path}/forwards`, this.next);
    this.router.post(`${this.path}/previous`, this.previous);
    this.router.put(
      `${this.path}/seek`,
      query('position').isInt().toInt(),
      this.seek
    );
    this.router.put(
      `${this.path}/volume`,
      query('volume').isInt({ max: 100, min: 0 }).toInt(),
      this.setVolume
    );
    this.router.post(
      `${this.path}/play`,
      query('uri')
        .optional()
        .custom((uri) => typeof uri === 'string' || Array.isArray(uri))
        .toArray(),
      this.play
    );
    this.router.post(
      `${this.path}/queue`,
      query('uri').isString(),
      this.addQueue
    );
  }

  private handleError = (err: Error) => {
    if (err instanceof SpotifyApiError) {
      return RequestError.fromSpotifyApiError(err);
    }
    if (err instanceof DeviceNotFoundError) {
      return new RequestError(
        'Spotify player device not found',
        StatusCodes.NOT_FOUND
      );
    }
    return err;
  };

  private getPlayer = async (
    _request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ): Promise<void> => {
    await this.player
      .getPlayer()
      .then((player) => {
        if (player) {
          response.send(player);
        } else {
          response.sendStatus(StatusCodes.NO_CONTENT);
        }
      })
      .catch((err) => next(this.handleError(err)));
  };

  private getQueue = (
    _request: express.Request,
    response: express.Response
  ): void => {
    response.send(this.player.getQueue());
  };

  private playPause = async (
    _request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ): Promise<void> => {
    await this.player
      .playPause()
      .then(() => response.sendStatus(StatusCodes.NO_CONTENT))
      .catch((err) => next(this.handleError(err)));
  };

  private next = async (
    _request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ): Promise<void> => {
    await this.player
      .next()
      .then(() => response.sendStatus(StatusCodes.NO_CONTENT))
      .catch((err) => next(this.handleError(err)));
  };

  private previous = async (
    _request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ): Promise<void> => {
    await this.player
      .previous()
      .then(() => response.sendStatus(StatusCodes.NO_CONTENT))
      .catch((err) => next(this.handleError(err)));
  };

  private seek = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ): Promise<void> => {
    const validationError = RequestError.validationResult(request);
    if (validationError) {
      next(validationError);
      return;
    }

    const data = matchedData(request) as SeekQuery;

    await this.player
      .seek(data.position)
      .then(() => response.sendStatus(StatusCodes.NO_CONTENT))
      .catch((err) => next(this.handleError(err)));
  };

  private setVolume = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ): Promise<void> => {
    const validationError = RequestError.validationResult(request);
    if (validationError) {
      next(validationError);
      return;
    }

    const data = matchedData(request) as VolumeQuery;

    await this.player
      .setVolume(data.volume)
      .then(() => response.sendStatus(StatusCodes.NO_CONTENT))
      .catch((err) => next(this.handleError(err)));
  };

  private play = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ): Promise<void> => {
    const validationError = RequestError.validationResult(request);
    if (validationError) {
      next(validationError);
      return;
    }

    const data = matchedData(request) as PlayQuery;

    await this.player
      .play(data.uri)
      .then(() => response.sendStatus(StatusCodes.NO_CONTENT))
      .catch((err) => next(this.handleError(err)));
  };

  private addQueue = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ): Promise<void> => {
    const validationError = RequestError.validationResult(request);
    if (validationError) {
      next(validationError);
      return;
    }

    const data = matchedData(request) as AddQueueQuery;

    await this.player
      .addQueue(data.uri)
      .then(() => response.sendStatus(StatusCodes.NO_CONTENT))
      .catch((err) => next(this.handleError(err)));
  };
}
