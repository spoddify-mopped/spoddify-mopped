import SpotifyPlayerService, { DeviceNotFoundError } from '../services/player';
import { matchedData, query } from 'express-validator';

import RequestError from '../error/request';
import { SpotifyApiError } from '../clients/spotify/error';
import { StatusCodes } from 'http-status-codes';
import express from 'express';

type SeekQuery = {
  position: string;
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
    this.router.put(
      `${this.path}/seek`,
      query('position').isString(),
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
    await this.spotifyPlayerService
      .getPlayer()
      .then((player) => response.send(player))
      .catch((err) => next(this.handleError(err)));
  };

  private playPause = async (
    _request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ): Promise<void> => {
    await this.spotifyPlayerService
      .playPause()
      .then(() => response.sendStatus(204))
      .catch((err) => next(this.handleError(err)));
  };

  private next = async (
    _request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ): Promise<void> => {
    await this.spotifyPlayerService
      .next()
      .then(() => response.sendStatus(204))
      .catch((err) => next(this.handleError(err)));
  };

  private previous = async (
    _request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ): Promise<void> => {
    await this.spotifyPlayerService
      .previous()
      .then(() => response.sendStatus(204))
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

    await this.spotifyPlayerService
      .seek(Number.parseInt(data.position))
      .then(() => response.sendStatus(204))
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

    await this.spotifyPlayerService
      .setVolume(data.volume)
      .then(() => response.sendStatus(204))
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

    await this.spotifyPlayerService
      .play(data.uri)
      .then(() => response.sendStatus(204))
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

    await this.spotifyPlayerService
      .addQueue(data.uri)
      .then(() => response.sendStatus(204))
      .catch((err) => next(this.handleError(err)));
  };
}
