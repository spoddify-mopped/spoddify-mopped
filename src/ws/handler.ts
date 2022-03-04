import Logger from '../logger/logger';
import Player from '../player/player';
import SystemService from '../services/system';
import io from 'socket.io';

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
    private readonly player: Player,
    private readonly io: io.Server
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
    this.handlers['WS_TO_SERVER_GET_PLAYER_STATE'] = this.handleGetPlayerState;

    this.player.onPlayerUpdate((player) => {
      this.io.emit(WS_EVENT_NAME, {
        payload: player || {},
        type: 'WS_TO_CLIENT_SET_PLAYER_STATE',
      });
    });
  }

  public handleGetPlayerState = async (): Promise<void> => {
    this.io.emit(WS_EVENT_NAME, {
      payload: (await this.player.getPlayer()) || {},
      type: 'WS_TO_CLIENT_SET_PLAYER_STATE',
    });
  };
}
