import {
  CoverReplacement,
  NextIcon,
  PauseIcon,
  PlayCircleIcon,
  PreviousIcon,
  VolumeIcon,
} from '../../assets';
import React, { ReactElement, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ApiClient from '../../clients/api';
import { AppState } from '../../redux/reducers';
import ArtistsTitle from '../../components/ArtistsTitle/ArtistsTitle';
import InputRange from '../../components/InputRange/InputRange';
import ProgressBar from '../../components/ProgressBar/ProgressBar';
import { playerActions } from '../../redux/player/actions';
import styles from './Player.module.scss';
import { useNavigate } from 'react-router-dom';

export default function Player(): ReactElement {
  const navigate = useNavigate();
  const player = useSelector((state: AppState) => state.player);
  const dispatch = useDispatch();

  useEffect(() => {
    if (player.item && player.item.artists) {
      document.title = `${player.item.name} - ${player.item.artists
        .map((artist) => artist.name)
        .join(',')}`;
    }
  }, [player.item]);

  useEffect(() => {
    dispatch(playerActions.getPlayer());
  }, [dispatch]);

  useEffect(() => {
    const closePlayer = (evt: KeyboardEvent) => {
      if (evt.key === 'Escape') {
        navigate(-1);
      }
    };

    document.addEventListener('keydown', closePlayer);

    return () => {
      document.removeEventListener('keydown', closePlayer);
    };
  }, [navigate]);

  const [volume, setVolume] = useState(0);

  useEffect(() => {
    setVolume(player.volume || 0);
  }, [player.volume]);

  const sendVolume = async () => await ApiClient.setVolume(volume);

  const getPlayerBackgroundStyles = () => {
    if (player.item?.imageUrl) {
      return {
        backgroundImage: `url(${player.item?.imageUrl})`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        boxShadow: 'inset 0 0 0 2000px rgba(0, 0, 0, 0.8)',
        filter: 'blur(12px)',
      };
    }
    return {};
  };

  const renderAlbumAndArtist = () => {
    if (!player.item?.artists || !player.item.album) {
      return <></>;
    }

    return (
      <span className={styles.artistAlbum}>
        <ArtistsTitle
          artists={player.item.artists || []}
          onArtistClick={(id) => navigate(`/artist/${id}`)}
        />{' '}
        -{' '}
        <span
          className={styles.link}
          onClick={() => navigate(`/album/${player.item?.album.id}`)}
        >
          {player.item.album.name}
        </span>
      </span>
    );
  };

  return (
    <div className={styles.player}>
      <div
        className={styles.bg}
        style={{
          ...getPlayerBackgroundStyles(),
        }}
      ></div>
      <span className={styles.backButton} onClick={() => navigate(-1)}>
        &larr;
      </span>
      <div className={styles.infoContainer}>
        <div className={styles.coverContainer}>
          <img
            className={styles.cover}
            src={player.item?.imageUrl || CoverReplacement}
            alt="Cover"
          />
        </div>
        <div className={styles.metadata}>
          <span className={styles.track}>{player.item?.name}</span>
          {renderAlbumAndArtist()}
        </div>
      </div>
      <div className={styles.bottom}>
        <div className={styles.progress}>
          <ProgressBar
            duration={player.item?.duration}
            isPlaying={player.isPlaying}
            startProgress={player.progress}
          />
        </div>
        <div className={styles.control}>
          <div className={styles.left}></div>
          <div className={styles.mid}>
            <button
              className={styles.button}
              onClick={() => {
                ApiClient.previous();
              }}
            >
              <PreviousIcon />
            </button>
            <button
              className={`${styles.button} ${styles.playpause}`}
              onClick={() => {
                ApiClient.playPause();
              }}
            >
              {player.isPlaying ? <PauseIcon /> : <PlayCircleIcon />}
            </button>
            <button
              className={styles.button}
              onClick={() => {
                ApiClient.next();
              }}
            >
              <NextIcon />
            </button>
          </div>
          <div className={styles.right}>
            <VolumeIcon className={styles.volumeLogo} />
            <InputRange
              className={styles.volumeInput}
              onChange={(evt) => {
                setVolume(Number.parseInt(evt.target.value));
              }}
              onMouseUp={sendVolume}
              onTouchEnd={sendVolume}
              value={volume}
              min={0}
              max={100}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
