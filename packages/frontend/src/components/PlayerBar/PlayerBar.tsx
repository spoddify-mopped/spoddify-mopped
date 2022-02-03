import React, { ReactElement } from 'react';

import { ReactComponent as Next } from '../../resources/step-forward-solid.svg';
import { ReactComponent as Pause } from '../../resources/pause-circle-solid.svg';
import { ReactComponent as Play } from '../../resources/play-circle-solid.svg';
import { ReactComponent as Prev } from '../../resources/step-backward-solid.svg';
import styles from './PlayerBar.module.scss';

export type PlayerInformation = {
  coverImgUri: string;
  artistName: string;
  albumName: string;
  trackName: string;
  isPlaying: boolean;
  progress: number;
  duration: number;
};

type Props = {
  playerInformation: PlayerInformation;
  onPrevious: () => void;
  onNext: () => void;
  onPlayPause: () => void;
};

const PlayerBar = (props: Props): ReactElement => {
  return (
    <div className={styles.playerbar}>
      <div className={styles.infoContainer}>
        <img src={props.playerInformation.coverImgUri} alt="Cover" />
        <div className={styles.info}>
          <span className={styles.track}>
            {props.playerInformation.trackName}
          </span>
          <span className={styles.artist}>
            {props.playerInformation.artistName}
          </span>
        </div>
      </div>
      <div className={styles.controls}>
        <Prev className={styles.prev} />
        {props.playerInformation.isPlaying ? (
          <Pause className={styles.pause} />
        ) : (
          <Play className={styles.play} />
        )}
        <Next className={styles.next} />
      </div>
      <div className={styles.volume}></div>
    </div>
  );
};

export default PlayerBar;
