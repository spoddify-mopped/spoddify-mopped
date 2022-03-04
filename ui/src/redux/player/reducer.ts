import { PlayerActionTypes, PlayerWebSocketToClientActions } from './types';

import { Track } from '../../clients/api.types';

export type PlayerState = {
  progress?: number;
  volume?: number;
  isPlaying: boolean;
  item?: Track;
};

const initialState: PlayerState = {
  isPlaying: false,
};

export const playerReducer = (
  state = initialState,
  action: PlayerActionTypes
): PlayerState => {
  switch (action.type) {
    case PlayerWebSocketToClientActions.WS_TO_CLIENT_SET_PLAYER_STATE:
      return action.payload;
    default:
      return state;
  }
};
