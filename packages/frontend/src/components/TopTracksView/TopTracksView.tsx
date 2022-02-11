import React, { useState } from 'react';

import { Track } from '../../clients/api.types';
import styles from './TopTracksView.module.scss';

type Props = {
  tracks: Track[];
  onClick: (id: string) => void;
};

const TopTracksView = (props: Props): React.ReactElement => {
  const [showMore, setShowMore] = useState(false);

  const renderTracks = () => {
    const tracks = showMore ? props.tracks : props.tracks.slice(0, 5);

    return tracks.map((track, index) => (
      <div
        className={styles.track}
        onClick={() => props.onClick(track.id)}
        key={`top_track_${track.id}`}
      >
        <span className={styles.number}>{index + 1}</span>
        <img src={track.imageUrl} alt="Cover" className={styles.cover} />
        <span className={styles.title} title={track.name}>
          {track.name}
        </span>
        <span className={styles.add}>+</span>
      </div>
    ));
  };

  return (
    <div className={styles.container}>
      {renderTracks()}
      <span className={styles.showmore} onClick={() => setShowMore(!showMore)}>
        {showMore ? 'SHOW LESS' : 'SHOW MORE'}
      </span>
    </div>
  );
};

export default TopTracksView;
