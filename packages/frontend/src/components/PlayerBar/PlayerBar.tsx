import React, { ReactElement } from 'react';

import { ReactComponent as Logo } from '../../resources/logo.svg';
import { ReactComponent as Next } from '../../resources/step-forward-solid.svg';
import { ReactComponent as Pause } from '../../resources/pause-circle-solid.svg';
import { ReactComponent as Play } from '../../resources/play-circle-solid.svg';
import { ReactComponent as Prev } from '../../resources/step-backward-solid.svg';
import ProgressBar from '../ProgressBar/ProgressBar';
import styles from './PlayerBar.module.scss';
import { useNavigate } from 'react-router';

export type PlayerInformation = {
  coverImgUri?: string;
  artistName?: string;
  albumName?: string;
  trackName?: string;
  isPlaying?: boolean;
  progress?: number;
  duration?: number;
};

type Props = {
  playerInformation: PlayerInformation;
  onPrevious: () => void;
  onNext: () => void;
  onPlayPause: () => void;
};

const PlayerBar = (props: Props): ReactElement => {
  const navigate = useNavigate();

  return (
    <div className={styles.playerbar}>
      <div className={styles.infoContainer}>
        <div onClick={() => navigate('/player')} className={styles.cover}>
          {props.playerInformation.coverImgUri ? (
            <img src={props.playerInformation.coverImgUri || ''} alt="Cover" />
          ) : (
            <div className={styles.coverReplacement}>
              <Logo />
            </div>
          )}
        </div>

        <div className={styles.info}>
          <span className={styles.track}>
            {props.playerInformation.trackName || ''}
          </span>
          <span className={styles.artist}>
            {props.playerInformation.artistName || ''}
          </span>
        </div>
      </div>
      <div className={styles.player}>
        <div className={styles.controls}>
          <Prev className={styles.prev} onClick={props.onPrevious} />
          {props.playerInformation.isPlaying ? (
            <Pause className={styles.pause} onClick={props.onPlayPause} />
          ) : (
            <Play className={styles.play} onClick={props.onPlayPause} />
          )}
          <Next className={styles.next} onClick={props.onNext} />
        </div>
        <ProgressBar
          duration={props.playerInformation.duration}
          isPlaying={props.playerInformation.isPlaying}
          startProgress={props.playerInformation.progress}
        />
      </div>
      <div className={styles.volume}></div>
    </div>
  );
};

export default PlayerBar;
