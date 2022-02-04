import './Player.css';

import React, { ReactElement, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ApiClient from '../../clients/api';
import { AppState } from '../../redux/reducers';
import { ReactComponent as Next } from '../../resources/step-forward-solid.svg';
import { ReactComponent as Pause } from '../../resources/pause-circle-solid.svg';
import { ReactComponent as Play } from '../../resources/play-circle-solid.svg';
import { ReactComponent as Prev } from '../../resources/step-backward-solid.svg';
import ProgressBar from '../../components/ProgressBar/ProgressBar';
import { playerActions } from '../../redux/player/actions';
import { useNavigate } from 'react-router-dom';

export default function Player(): ReactElement {
  const navigate = useNavigate();
  const player = useSelector((state: AppState) => state.player);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(playerActions.getPlayer());
  }, [dispatch]);

  return (
    <div className="player">
      <span className="playerBackButton" onClick={() => navigate(-1)}>
        &larr;
      </span>
      <div className="metadata">
        <img className="coverart" src={player.coverUrl} alt="Cover" />
        <p className="playerTrack">{player.track}</p>
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
      <ProgressBar
        duration={player.duration}
        isPlaying={player.isPlaying}
        startProgress={player.progress}
      />
    </div>
  );
}
