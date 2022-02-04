import SpotifyClient from '../clients/spotify/spotify';
import io from 'socket.io';

const WS_EVENT_NAME = 'action';

type SocketHandler = () => void;

type Action<T = unknown> = {
  payload: T;
  type: string;
};

export default class WebsocketHandler {
  private handlers: Record<string, SocketHandler> = {};

  private spotifyClient: SpotifyClient;
  private io: io.Server;

  public constructor(spotifyClient: SpotifyClient, io: io.Server) {
    this.spotifyClient = spotifyClient;
    this.io = io;

    this.initializeHandlers();
  }

  private getHandler = (type: string): SocketHandler => {
    return this.handlers[type];
  };

  public handle = (action: Action): void => {
    const handler = this.getHandler(action.type);
    if (handler) {
      handler();
    }
  };

  private initializeHandlers() {
    this.handlers['WS_TO_SERVER_GET_PLAYER_STATE'] = this.sendPlayerState;
  }

  public sendPlayerState = async (): Promise<void> => {
    const player = await this.spotifyClient.getPlayer();
    if (!player) {
      // TODO: Send empty player websocket
      return;
    }

    this.io.emit(WS_EVENT_NAME, {
      payload: {
        album: player.item.album.name,
        artist: player.item.artists.map((artist) => artist.name).join(', '),
        coverUrl: player.item.album.images[0].url,
        duration: player.item.duration_ms,
        isPlaying: player.is_playing,
        progress: player.progress_ms,
        track: player.item.name,
      },
      type: 'WS_TO_CLIENT_SET_PLAYER_STATE',
    });
  };
}
