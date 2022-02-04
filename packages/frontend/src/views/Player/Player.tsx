import './Player.css';

import React, { ReactElement } from 'react';

import ApiClient from '../../clients/api';
import { AppState } from '../../redux/reducers';
import { ReactComponent as Next } from '../../resources/step-forward-solid.svg';
import { ReactComponent as Pause } from '../../resources/pause-circle-solid.svg';
import { ReactComponent as Play } from '../../resources/play-circle-solid.svg';
import { ReactComponent as Prev } from '../../resources/step-backward-solid.svg';
import { useSelector } from 'react-redux';

export default function Player(): ReactElement {
  const player = useSelector((state: AppState) => state.player);

  return (
    <div className="player">
      <div className="metadata">
        <img className="coverart" src={player.coverUrl} alt="Cover" />
        <p>{player.track}</p>
        <p>{player.artist}</p>
      </div>
      <div className="control">
        <button
          className="playerButton"
          onClick={() => {
            ApiClient.previous();
          }}
        >
          <Prev />
        </button>
        <button
          className="playerButton pausebutton"
          onClick={() => {
            ApiClient.playPause();
          }}
        >
          {player.isPlaying ? <Pause /> : <Play />}
        </button>
        <button
          className="playerButton"
          onClick={() => {
            ApiClient.next();
          }}
        >
          <Next />
        </button>
      </div>
    </div>
  );
}
