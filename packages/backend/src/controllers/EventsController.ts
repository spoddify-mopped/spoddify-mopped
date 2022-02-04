import { Server } from 'socket.io';
import express from 'express';
import { spotifyClient } from './../index';

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
    spotifyClient.getPlayer().then((data) => {
      this.io.emit('action', {
        payload: {
          album: data.item.album.name,
          artist: data.item.artists.map((artist) => artist.name).join(', '),
          coverUrl: data.item.album.images[0].url,
          duration: data.item.duration_ms,
          isPlaying: data.is_playing,
          progress: data.progress_ms,
          track: data.item.name,
        },
        type: 'WS_TO_CLIENT_SET_PLAYER_STATE',
      });
    });

    response.sendStatus(204);
  };
}
