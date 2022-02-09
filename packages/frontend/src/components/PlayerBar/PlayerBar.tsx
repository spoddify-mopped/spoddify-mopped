import React, { ReactElement } from 'react';

import { Artist } from '../../clients/api.types';
import CoverReplacement from '../../resources/cover_replacement.png';
import { ReactComponent as FullScreen } from '../../resources/fullscreen.svg';
import { ReactComponent as Next } from '../../resources/step-forward-solid.svg';
import { ReactComponent as Pause } from '../../resources/pause-circle-solid.svg';
import { ReactComponent as Play } from '../../resources/play-circle-solid.svg';
import { ReactComponent as Prev } from '../../resources/step-backward-solid.svg';
import ProgressBar from '../ProgressBar/ProgressBar';
import styles from './PlayerBar.module.scss';
import { useNavigate } from 'react-router';

export type PlayerInformation = {
  artists?: Artist[];
  albumId?: string;
  coverImgUri?: string;
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

  const renderArtists = () => {
    if (props.playerInformation.artists) {
      const artistCount = props.playerInformation.artists.length;

      return (
        <span className={styles.artist}>
          {props.playerInformation.artists.map((artist, index) => (
            <>
              <span
                className={styles.link}
                key={artist.id}
                onClick={() => navigate(`/artist/${artist.id}`)}
              >
                {artist.name}
              </span>
              {index === artistCount - 1 ? ' ' : ', '}
            </>
          ))}
        </span>
      );
    }
  };

  return (
    <div className={styles.playerbar}>
      <div className={styles.infoContainer}>
        <div className={styles.cover}>
          {props.playerInformation.coverImgUri ? (
            <img
              src={props.playerInformation.coverImgUri || CoverReplacement}
              alt="Cover"
            />
          ) : (
            <></>
          )}
        </div>

        <div className={styles.info}>
          <span
            className={`${styles.track} ${styles.link}`}
            onClick={() =>
              navigate(`/album/${props.playerInformation.albumId}`)
            }
          >
            {props.playerInformation.trackName || ''}
          </span>
          {renderArtists()}
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
      <div className={styles.right}>
        <span className={styles.fullscreen}>
          <FullScreen
            className={styles.fullscreen}
            onClick={() => navigate('/player')}
          />
        </span>
      </div>
    </div>
  );
};

export default PlayerBar;
