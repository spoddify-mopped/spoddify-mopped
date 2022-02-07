import React, { useEffect, useState } from 'react';

import ApiClient from '../../clients/api';
import Error from '../../components/Error/Error';
import FullLoadingView from '../FullLoadingView/FullLoadingView';
import { ReactComponent as Play } from '../../resources/play-solid.svg';
import { Playlist } from '../../clients/api.types';
import styles from './PlaylistView.module.scss';
import { useNavigate } from 'react-router-dom';

export default function PlaylistView(): React.ReactElement {
  const navigate = useNavigate();

  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    ApiClient.getPlaylists()
      .then(setPlaylists)
      .catch(() => setIsError(true))
      .finally(() => setIsLoading(false));
  }, []);

  const renderPlaylists = () => {
    return playlists.map((playlist) => (
      <div className={styles.playlist} key={playlist.id}>
        <p
          className={styles.name}
          onClick={() => navigate(`/playlist/${playlist.id}`)}
        >
          {playlist.name}
        </p>
        <button
          className={styles.button}
          onClick={() => ApiClient.playPlaylist(playlist.id)}
        >
          <Play />
        </button>
      </div>
    ));
  };

  if (isLoading) {
    return <FullLoadingView />;
  }

  if (isError) {
    return <Error />;
  }

  if (playlists.length === 0) {
    return (
      <div className={styles.noContent}>
        <span>No playlists.</span>
        <span>Get started and add some tracks.</span>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.headline}>Choose a genre</h1>
      <div className={styles.playlistContainer}>{renderPlaylists()}</div>
    </div>
  );
}
