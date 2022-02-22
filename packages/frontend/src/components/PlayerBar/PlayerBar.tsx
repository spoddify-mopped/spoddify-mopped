import {
  CoverReplacement,
  FullscreenIcon,
  NextIcon,
  PauseIcon,
  PlayCircleIcon,
  PreviousIcon,
  VolumeIcon,
} from '../../assets';
import React, { ReactElement, useEffect, useState } from 'react';

import ApiClient from '../../clients/api';
import { Artist } from '../../clients/api.types';
import ArtistsTitle from '../ArtistsTitle/ArtistsTitle';
import InputRange from '../InputRange/InputRange';
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
  volume?: number;
};

type Props = {
  playerInformation: PlayerInformation;
  onPrevious: () => void;
  onNext: () => void;
  onPlayPause: () => void;
};

const PlayerBar = (props: Props): ReactElement => {
  const navigate = useNavigate();

  const [volume, setVolume] = useState(0);

  useEffect(() => {
    setVolume(props.playerInformation.volume || 0);
  }, [props.playerInformation.volume]);

  const sendVolume = async () => await ApiClient.setVolume(volume);

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
          <ArtistsTitle
            className={styles.artist}
            artists={props.playerInformation.artists || []}
            onArtistClick={(id) => navigate(`/artist/${id}`)}
          />
        </div>
      </div>
      <div className={styles.player}>
        <div className={styles.controls}>
          <PreviousIcon className={styles.prev} onClick={props.onPrevious} />
          {props.playerInformation.isPlaying ? (
            <PauseIcon className={styles.pause} onClick={props.onPlayPause} />
          ) : (
            <PlayCircleIcon
              className={styles.play}
              onClick={props.onPlayPause}
            />
          )}
          <NextIcon className={styles.next} onClick={props.onNext} />
        </div>
        <div className={styles.progress}>
          <ProgressBar
            duration={props.playerInformation.duration}
            isPlaying={props.playerInformation.isPlaying}
            startProgress={props.playerInformation.progress}
          />
        </div>
      </div>
      <div className={styles.right}>
        <VolumeIcon className={styles.volumeLogo} />
        <InputRange
          onChange={(evt) => {
            setVolume(Number.parseInt(evt.target.value));
          }}
          onMouseUp={sendVolume}
          onTouchEnd={sendVolume}
          value={volume}
          min={0}
          max={100}
        />
        <FullscreenIcon
          className={styles.fullscreen}
          onClick={() => navigate('/player')}
        />
      </div>
    </div>
  );
};

export default PlayerBar;
