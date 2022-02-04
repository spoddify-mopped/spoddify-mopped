import { PlayerState } from './reducer';

export enum PlayerWebSocketToClientActions {
  WS_TO_CLIENT_SET_PLAYER_STATE = 'WS_TO_CLIENT_SET_PLAYER_STATE',
}

export enum PlayerWebSocketToServerActions {
  WS_TO_SERVER_GET_PLAYER_STATE = 'WS_TO_SERVER_GET_PLAYER_STATE',
}

type SetPlayerStateAction = {
  type: PlayerWebSocketToClientActions;
  payload: PlayerState;
};

type GetPlayerStateAction = {
  type: PlayerWebSocketToServerActions;
};

export type PlayerActionTypes = SetPlayerStateAction | GetPlayerStateAction;
