import { Album, Artist } from '../../clients/api.types';
import { PlayerActionTypes, PlayerWebSocketToClientActions } from './types';

export type PlayerState = {
  artists?: Artist[];
  album?: Album;
  track?: string;
  trackId?: string;
  coverUrl?: string;
  progress?: number;
  duration?: number;
  volume?: number;
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
