import React from 'react';
import { Track } from '../../clients/api.types';
import styles from './TrackView.module.scss';

type Props = {
  tracks: Track[];
  onTrackActionClick?: (track: Track) => void;
  clickElement?: React.ReactElement;
};

const TrackView = (props: Props): React.ReactElement => {
  const renderTracks = () => {
    return props.tracks.map((track) => (
      <div className={styles.entryContainer}>
        <div className={styles.entry}>
          {track.imageUrl ? <img alt="" src={track.imageUrl} /> : undefined}
          <div className={styles.trackInfo}>
            <span className={styles.trackTitle} title={track.name}>
              {track.name}
            </span>
            <span className={styles.artistName}>
              {track.artists.map((trackArtist, index) => (
                <span>
                  {trackArtist.name}
                  {index !== track.artists.length - 1 ? ', ' : ''}
                </span>
              ))}
            </span>
          </div>
        </div>
        {props.onTrackActionClick ? (
          <div
            onClick={() =>
              props.onTrackActionClick && props.onTrackActionClick(track)
            }
          >
            {props.clickElement}
          </div>
        ) : (
          <></>
        )}
      </div>
    ));
  };

  return <div className={styles.container}>{renderTracks()}</div>;
};

export default TrackView;
