import React, { ReactElement, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ApiClient from '../../clients/api';
import { AppState } from '../../redux/reducers';
import CoverReplacement from '../../resources/cover_replacement.png';
import { ReactComponent as Next } from '../../resources/step-forward-solid.svg';
import { ReactComponent as Pause } from '../../resources/pause-circle-solid.svg';
import { ReactComponent as Play } from '../../resources/play-circle-solid.svg';
import { ReactComponent as Prev } from '../../resources/step-backward-solid.svg';
import ProgressBar from '../../components/ProgressBar/ProgressBar';
import { playerActions } from '../../redux/player/actions';
import styles from './Player.module.scss';
import { useNavigate } from 'react-router-dom';

export default function Player(): ReactElement {
  const navigate = useNavigate();
  const player = useSelector((state: AppState) => state.player);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(playerActions.getPlayer());
  }, [dispatch]);

  const getPlayerBackgroundStyles = () => {
    if (player.coverUrl) {
      return {
        backgroundImage: `url(${player.coverUrl})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        boxShadow: 'inset 0 0 0 2000px rgba(0, 0, 0, 0.9)',
      };
    }
    return {};
  };

  return (
    <div
      className={styles.player}
      style={{
        ...getPlayerBackgroundStyles(),
      }}
    >
      <span className={styles.backButton} onClick={() => navigate(-1)}>
        &larr;
      </span>
      <div className={styles.infoContainer}>
        <div className={styles.coverContainer}>
          <img
            className={styles.cover}
            src={player.coverUrl || CoverReplacement}
            alt="Cover"
          />
        </div>
        <div className={styles.metadata}>
          <span className={styles.track}>{player.track}</span>
          <p className={styles.artistAlbum}>
            {player.artist} - {player.album}
          </p>
        </div>
      </div>
      <div>
        <div className={styles.control}>
          <button
            className={styles.button}
            onClick={() => {
              ApiClient.previous();
            }}
          >
            <Prev />
          </button>
          <button
            className={`${styles.button} ${styles.playpause}`}
            onClick={() => {
              ApiClient.playPause();
            }}
          >
            {player.isPlaying ? <Pause /> : <Play />}
          </button>
          <button
            className={styles.button}
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
    </div>
  );
}
