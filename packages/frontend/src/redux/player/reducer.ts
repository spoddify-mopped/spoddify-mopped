import { PlayerActionTypes, PlayerWebSocketToClientActions } from './types';

export type PlayerState = {
  artist?: string;
  album?: string;
  track?: string;
  coverUrl?: string;
  progress?: number;
  duration?: number;
  isPlaying: boolean;
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
