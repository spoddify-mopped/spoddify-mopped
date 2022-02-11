import React, { useEffect, useState } from 'react';

import ApiClient from '../../clients/api';
import CoverReplacement from '../../resources/cover_replacement.png';
import { FullPlaylist } from '../../clients/api.types';
import ImageUtils from '../../utils/image';
import TrackView from '../../components/TrackView/TrackView';
import styles from './PlaylistDetailView.module.scss';
import { useParams } from 'react-router-dom';

const PlaylistDetailView = (): React.ReactElement => {
  const params = useParams();

  const [playlist, setPlaylist] = useState<FullPlaylist | undefined>(undefined);

  const [image, setImage] = useState<string | undefined>(undefined);

  useEffect(() => {
    const id = params['id'];

    if (id) {
      ApiClient.getPlaylist(Number.parseInt(id)).then(setPlaylist);
    }
  }, [params]);

  useEffect(() => {
    if (!playlist) {
      return;
    }

    const images = playlist.tracks
      .filter(
        (value, index, self) =>
          index === self.findIndex((t) => t.imageUrl === value.imageUrl)
      )
      .map((track) => track.imageUrl || '');

    while (images.length < 4) {
      images.push(...images);
    }

    ImageUtils.collage(images, 600).then(setImage);
  }, [playlist]);

  if (!playlist) {
    return <></>;
  }

  return (
    <div>
      <div
        className={styles.header}
        style={{
          backgroundImage: `url(${image})`,
          backgroundPosition: 'center',
          boxShadow: 'inset 0 0 0 2000px rgba(0, 0, 0, 0.9)',
        }}
      >
        <img src={image || CoverReplacement} alt="Cover" />
        <div className={styles.meta}>
          <span className={styles.title}>{playlist.name}</span>
        </div>
      </div>
      <div className={styles.innerContainer}>
        <TrackView tracks={playlist.tracks} />
      </div>
    </div>
  );
};

export default PlaylistDetailView;
