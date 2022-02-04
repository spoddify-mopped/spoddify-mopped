import { PlayerState } from './player/reducer';
import { combineReducers } from 'redux';
import { playerReducer } from './player';

export type AppState = {
  player: PlayerState;
};

export default combineReducers({
  player: playerReducer,
});
