import { Server } from 'socket.io';
import SpotifyClient from '../clients/spotify/spotify';
import express from 'express';

export default class EventController {
  public path = '/event';
  public router = express.Router();

  private io: Server;
  private spotifyClient: SpotifyClient;

  public constructor(io: Server, spotifyClient: SpotifyClient) {
    this.io = io;
    this.spotifyClient = spotifyClient;

    this.initializeRoutes();
  }

  public initializeRoutes(): void {
    this.router.post(`${this.path}`, this.newEvent);
  }

  private newEvent = (
    _request: express.Request,
    response: express.Response
  ): void => {
    this.spotifyClient.getPlayer().then((data) => {
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
