import React, { useState } from 'react';

import ArtistsTitle from '../ArtistsTitle/ArtistsTitle';
import { Track } from '../../clients/api.types';
import styles from './TracksView.module.scss';

type Props = {
  tracks: Track[];
  showNumbers?: boolean;
  showArtists?: boolean;
  enableShowMore?: boolean;
  maxWidth?: string;
  onArtistClick?: (id: string) => void;
  onClick: (id: string) => void;
};

const TracksView = (props: Props): React.ReactElement => {
  const [showMore, setShowMore] = useState(false);

  const renderTracks = () => {
    const tracks = showMore ? props.tracks : props.tracks.slice(0, 5);

    return tracks.map((track, index) => (
      <div
        className={styles.track}
        onClick={() => props.onClick(track.id)}
        key={`top_track_${track.id}`}
      >
        {props.showNumbers ? (
          <span className={styles.number}>{index + 1}</span>
        ) : (
          <></>
        )}
        <img
          src={track.imageUrl}
          alt="Cover"
          className={`${styles.cover} ${
            !props.showNumbers ? styles.coverMargin : ''
          }`}
        />
        <div className={styles.metaContainer}>
          <span className={styles.title} title={track.name}>
            {track.name}
          </span>
          {props.showArtists ? (
            <ArtistsTitle
              className={styles.artists}
              artists={track.artists}
              onArtistClick={(id) =>
                props.onArtistClick && props.onArtistClick(id)
              }
            />
          ) : (
            <></>
          )}
        </div>
        <span className={styles.add}>+</span>
      </div>
    ));
  };

  return (
    <div style={{ maxWidth: props.maxWidth }}>
      {renderTracks()}
      {props.enableShowMore ? (
        <span
          className={styles.showmore}
          onClick={() => setShowMore(!showMore)}
        >
          {showMore ? 'SHOW LESS' : 'SHOW MORE'}
        </span>
      ) : (
        <></>
      )}
    </div>
  );
};

export default TracksView;
