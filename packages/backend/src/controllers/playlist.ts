import { DeviceNotFoundError } from '../services/player';
import PlaylistService from '../services/playlist';
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
    this.router.post(`${this.path}/add/track`, this.addTrack);
    this.router.post(`${this.path}/add/album`, this.addAlbum);
    this.router.get(`${this.path}`, this.getPlaylists);
    this.router.get(`${this.path}/:id`, this.getPlaylist);
    this.router.get(`${this.path}/:id/play`, this.playPlaylist);
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
    response: express.Response
  ): Promise<void> => {
    const { body } = request;

    if (!body.id) {
      response.sendStatus(400);
      return;
    }

    await this.playlistService
      .sortInTrack(body.id)
      .then(() => response.sendStatus(204))
      .catch((error) => this.handleError(error, response));
  };

  private addAlbum = async (
    request: express.Request,
    response: express.Response
  ): Promise<void> => {
    const { body } = request;

    if (!body.id) {
      response.sendStatus(400);
      return;
    }

    await this.playlistService
      .sortInAlbum(body.id)
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
    response: express.Response
  ): Promise<void> => {
    const id = Number.parseInt(request.params.id);

    if (!id) {
      response.sendStatus(400);
      return;
    }

    await this.playlistService
      .getPlaylist(id)
      .then((playlist) => response.send(playlist))
      .catch((error) => this.handleError(error, response));
  };

  private playPlaylist = async (
    request: express.Request,
    response: express.Response
  ): Promise<void> => {
    const id = Number.parseInt(request.params.id);

    if (!id) {
      response.sendStatus(400);
      return;
    }

    await this.playlistService
      .playPlaylist(id)
      .then(() => response.sendStatus(204))
      .catch((error) => this.handleError(error, response));
  };
}
