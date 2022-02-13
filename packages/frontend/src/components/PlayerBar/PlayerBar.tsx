import React, { ReactElement, useEffect, useState } from 'react';

import ApiClient from '../../clients/api';
import { Artist } from '../../clients/api.types';
import ArtistsTitle from '../ArtistsTitle/ArtistsTitle';
import CoverReplacement from '../../resources/cover_replacement.png';
import { ReactComponent as FullScreen } from '../../resources/fullscreen.svg';
import InputRange from '../InputRange/InputRange';
import { ReactComponent as Next } from '../../resources/step-forward-solid.svg';
import { ReactComponent as Pause } from '../../resources/pause-circle-solid.svg';
import { ReactComponent as Play } from '../../resources/play-circle-solid.svg';
import { ReactComponent as Prev } from '../../resources/step-backward-solid.svg';
import ProgressBar from '../ProgressBar/ProgressBar';
import { ReactComponent as Volume } from '../../resources/volume.svg';
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
          <Prev className={styles.prev} onClick={props.onPrevious} />
          {props.playerInformation.isPlaying ? (
            <Pause className={styles.pause} onClick={props.onPlayPause} />
          ) : (
            <Play className={styles.play} onClick={props.onPlayPause} />
          )}
          <Next className={styles.next} onClick={props.onNext} />
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
        <Volume className={styles.volumeLogo} />
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
        <FullScreen
          className={styles.fullscreen}
          onClick={() => navigate('/player')}
        />
      </div>
    </div>
  );
};

export default PlayerBar;
