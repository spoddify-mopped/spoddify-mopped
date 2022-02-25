import PlaylistService, { PlaylistNotFoundError } from '../services/playlist';
import { body, matchedData, param } from 'express-validator';

import { DeviceNotFoundError } from '../services/player';
import RequestError from '../error/request';
import { StatusCodes } from 'http-status-codes';
import express from 'express';

type AddToPlaylistRequest = {
  id: string;
};

type GetPlaylistRequest = {
  id: number;
};

export default class PlaylistController {
  public path = '/playlist';
  public router = express.Router();

  public constructor(private readonly playlistService: PlaylistService) {
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
      param('id').isNumeric().toInt(),
      this.getPlaylist
    );
    this.router.post(
      `${this.path}/:id/play`,
      param('id').isNumeric().toInt(),
      this.playPlaylist
    );
  }

  private handleError = (error: Error, response: express.Response) => {
    if (error instanceof DeviceNotFoundError) {
      response.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        msg: 'Player not found',
      });
    } else {
      response.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
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

    const data = matchedData(request) as AddToPlaylistRequest;

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

    const data = matchedData(request) as AddToPlaylistRequest;

    await this.playlistService
      .sortInAlbum(data.id)
      .then(() => response.sendStatus(204))
      .catch((error) => this.handleError(error, response));
  };

  private getPlaylists = async (
    _request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ): Promise<void> => {
    await this.playlistService
      .getPlaylists()
      .then((playlists) => response.send(playlists))
      .catch((error) => next(error));
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

    const data = matchedData(request) as GetPlaylistRequest;

    await this.playlistService
      .getPlaylist(data.id)
      .then((playlist) => response.send(playlist))
      .catch((error) => {
        if (error instanceof PlaylistNotFoundError) {
          next(new RequestError('Playlist not found', StatusCodes.NOT_FOUND));
        } else {
          next(error);
        }
      });
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

    const data = matchedData(request) as GetPlaylistRequest;

    await this.playlistService
      .playPlaylist(data.id)
      .then(() => response.sendStatus(204))
      .catch((error) => {
        if (error instanceof PlaylistNotFoundError) {
          next(new RequestError('Playlist not found', StatusCodes.NOT_FOUND));
        } else {
          next(error);
        }
      });
  };
}
