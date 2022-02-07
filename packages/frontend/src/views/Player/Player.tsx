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
    if (player.artists && player.track) {
      document.title = `${player.track} - ${player.artists
        .map((artist) => artist.name)
        .join(',')}`;
    }
  }, [player.artists, player.track]);

  useEffect(() => {
    dispatch(playerActions.getPlayer());
  }, [dispatch]);

  const getPlayerBackgroundStyles = () => {
    if (player.coverUrl) {
      return {
        backgroundImage: `url(${player.coverUrl})`,
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
    if (!player.artists || !player.album) {
      return <></>;
    }

    const artistCount = player.artists.length;

    return (
      <span className={styles.artistAlbum}>
        {player.artists.map((artist, index) => (
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
        ))}{' '}
        -{' '}
        <span
          className={styles.link}
          onClick={() => navigate(`/album/${player.album?.id}`)}
        >
          {player.album.name}
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
            src={player.coverUrl || CoverReplacement}
            alt="Cover"
          />
        </div>
        <div className={styles.metadata}>
          <span className={styles.track}>{player.track}</span>
          {renderAlbumAndArtist()}
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
