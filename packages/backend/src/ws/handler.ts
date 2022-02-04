import SpotifyClient from '../clients/spotify/spotify';
import io from 'socket.io';

const WS_EVENT_NAME = 'action';

type SocketHandler = (socket: io.Server) => void;

export default class WebsocketHandler {
  private handlers: Record<string, SocketHandler> = {};

  private spotifyClient: SpotifyClient;

  public constructor(spotifyClient: SpotifyClient) {
    this.spotifyClient = spotifyClient;

    this.initializeHandlers();
  }

  public getHandler = (type: string): SocketHandler => {
    return this.handlers[type];
  };

  private initializeHandlers() {
    this.handlers['WS_TO_SERVER_GET_PLAYER_STATE'] = this.sendPlayerState;
  }

  public sendPlayerState = async (socket: io.Server): Promise<void> => {
    const player = await this.spotifyClient.getPlayer();

    if (!player) {
      // TODO: Send empty player websocket
      return;
    }

    socket.emit(WS_EVENT_NAME, {
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
