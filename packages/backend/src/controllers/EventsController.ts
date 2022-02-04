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
      this.io.emit('action', {
        payload: {
          album: spotifyResponse.body.item['album'].name,
          artist: spotifyResponse.body.item['artists'][0].name,
          coverUrl: spotifyResponse.body.item['album']['images'][0].url,
          duration: spotifyResponse.body.item.duration_ms,
          isPlaying: spotifyResponse.body.is_playing,
          progress: spotifyResponse.body.progress_ms,
          track: spotifyResponse.body.item.name,
        },
        type: 'WS_TO_CLIENT_SET_PLAYER_STATE',
      });
    });

    response.sendStatus(204);
  };
}
