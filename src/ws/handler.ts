import SpotifyPlayerService, { DeviceNotFoundError } from '../services/player';

import Logger from '../logger/logger';
import PluginApi from '../plugins/api';
import SystemService from '../services/system';
import io from 'socket.io';
import { mapBaseSpotifyArtistToArtist } from './../models/artist';
import { mapSpotifyAlbumToAlbum } from './../models/album';

const WS_EVENT_NAME = 'action';

type SocketHandler = () => void;

type Action<T = unknown> = {
  payload: T;
  type: string;
};

export default class WebsocketHandler {
  private readonly logger = Logger.create(WebsocketHandler.name);

  private handlers: Record<string, SocketHandler> = {};

  public constructor(
    private readonly systemService: SystemService,
    private readonly spotifyPlayerService: SpotifyPlayerService,
    private readonly io: io.Server,
    private readonly pluginApi: PluginApi
  ) {
    this.initializeHandlers();
  }

  private getHandler = (type: string): SocketHandler => {
    return this.handlers[type];
  };

  public handle = (action: Action): void => {
    if (!this.systemService.isReady()) {
      return;
    }

    const handler = this.getHandler(action.type);
    if (handler) {
      handler();
    }
  };

  private initializeHandlers() {
    this.handlers['WS_TO_SERVER_GET_PLAYER_STATE'] = this.sendPlayerState;
  }

  public sendPlayerState = async (): Promise<void> => {
    try {
      const player = await this.spotifyPlayerService.getPlayer();

      if (!player) {
        // TODO: Send empty player websocket
        return;
      }

      this.pluginApi.emit('player', player);

      this.io.emit(WS_EVENT_NAME, {
        payload: {
          album: mapSpotifyAlbumToAlbum(player.item.album),
          artists: player.item.artists.map(mapBaseSpotifyArtistToArtist),
          coverUrl: player.item.album.images[0].url,
          duration: player.item.duration_ms,
          isPlaying: player.is_playing,
          progress: player.progress_ms,
          track: player.item.name,
          trackId: player.item.id,
          volume: player.device.volume_percent,
        },
        type: 'WS_TO_CLIENT_SET_PLAYER_STATE',
      });
    } catch (error) {
      if (error instanceof DeviceNotFoundError) {
        // TODO: Send empty player websocket
        return;
      }

      this.logger.error(error);
    }
  };
}
