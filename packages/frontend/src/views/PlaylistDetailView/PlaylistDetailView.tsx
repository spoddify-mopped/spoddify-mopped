import React, { useEffect, useState } from 'react';

import ApiClient from '../../clients/api';
import { FullPlaylist } from '../../clients/api.types';
import TrackView from '../../components/TrackView/TrackView';
import styles from './PlaylistDetailView.module.scss';
import { useParams } from 'react-router-dom';

const PlaylistDetailView = (): React.ReactElement => {
  const params = useParams();

  const [playlist, setPlaylist] = useState<FullPlaylist | undefined>(undefined);

  useEffect(() => {
    const id = params['id'];

    if (id) {
      ApiClient.getPlaylist(Number.parseInt(id)).then(setPlaylist);
    }
  }, [params]);

  if (!playlist) {
    return <></>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.headline}>{playlist.name}</h1>
      <TrackView tracks={playlist.tracks} />
    </div>
  );
};

export default PlaylistDetailView;
