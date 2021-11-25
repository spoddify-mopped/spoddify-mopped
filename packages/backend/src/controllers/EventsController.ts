import { Server } from 'socket.io';
import express from 'express';
import { spotifyApi } from './../index';

export default class EventController {
  public path = '/event';
  public router = express.Router();

  private io: Server;

  constructor(io: Server) {
    this.io = io;
    this.initializeRoutes();
  }

  public initializeRoutes(): void {
    this.router.post(`${this.path}`, this.newEvent);
  }

  private newEvent = (
    _request: express.Request,
    response: express.Response
  ): void => {
    spotifyApi.getMyCurrentPlaybackState().then((spotifyResponse) => {
      this.io.emit('player', spotifyResponse.body);
    });

    response.sendStatus(204);
  };
}
