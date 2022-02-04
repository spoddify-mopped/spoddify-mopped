import { PlayerActionTypes, PlayerWebSocketToServerActions } from './types';

export const playerActions = {
  getPlayer: (): PlayerActionTypes => ({
    type: PlayerWebSocketToServerActions.WS_TO_SERVER_GET_PLAYER_STATE,
  }),
};
