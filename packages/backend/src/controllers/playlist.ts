import { body, matchedData, param } from 'express-validator';

import { DeviceNotFoundError } from '../services/player';
import PlaylistService from '../services/playlist';
import RequestError from '../error/request';
import express from 'express';

export default class PlaylistController {
  public path = '/playlist';
  public router = express.Router();

  private playlistService: PlaylistService;

  public constructor(playlistService: PlaylistService) {
    this.playlistService = playlistService;

    this.initializeRoutes();
  }

  public initializeRoutes(): void {
    this.router.post(
      `${this.path}/add/track`,
      body('id').isString(),
      this.addTrack
    );
    this.router.post(
      `${this.path}/add/album`,
      body('id').isString(),
      this.addAlbum
    );
    this.router.get(`${this.path}`, this.getPlaylists);
    this.router.get(
      `${this.path}/:id`,
      param('id').isNumeric(),
      this.getPlaylist
    );
    this.router.post(
      `${this.path}/:id/play`,
      param('id').isNumeric(),
      this.playPlaylist
    );
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

  private addTrack = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ): Promise<void> => {
    const validationError = RequestError.validationResult(request);
    if (validationError) {
      next(validationError);
      return;
    }

    const data = matchedData(request);

    await this.playlistService
      .sortInTrack(data.id)
      .then(() => response.sendStatus(204))
      .catch((error) => this.handleError(error, response));
  };

  private addAlbum = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ): Promise<void> => {
    const validationError = RequestError.validationResult(request);
    if (validationError) {
      next(validationError);
      return;
    }

    const data = matchedData(request);

    await this.playlistService
      .sortInAlbum(data.id)
      .then(() => response.sendStatus(204))
      .catch((error) => this.handleError(error, response));
  };

  private getPlaylists = async (
    _request: express.Request,
    response: express.Response
  ): Promise<void> => {
    await this.playlistService
      .getPlaylists()
      .then((playlists) => response.send(playlists))
      .catch((error) => this.handleError(error, response));
  };

  private getPlaylist = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ): Promise<void> => {
    const validationError = RequestError.validationResult(request);
    if (validationError) {
      next(validationError);
      return;
    }

    const data = matchedData(request);
    const id = Number.parseInt(data.id);

    await this.playlistService
      .getPlaylist(id)
      .then((playlist) => response.send(playlist))
      .catch((error) => this.handleError(error, response));
  };

  private playPlaylist = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ): Promise<void> => {
    const validationError = RequestError.validationResult(request);
    if (validationError) {
      next(validationError);
      return;
    }

    const data = matchedData(request);
    const id = Number.parseInt(data.id);

    await this.playlistService
      .playPlaylist(id)
      .then(() => response.sendStatus(204))
      .catch((error) => this.handleError(error, response));
  };
}
