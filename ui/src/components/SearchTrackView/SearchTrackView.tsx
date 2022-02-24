import React, { ReactElement } from 'react';

import { AddIcon } from '../../assets';
import { Track } from '../../clients/api.types';
import TrackView from '../TrackView/TrackView';
import styles from './SearchTrackView.module.scss';

interface Props {
  tracks: Track[];
  onAddTrackClick: (track: Track) => void;
}

const SearchTrackView = (props: Props): ReactElement => {
  return (
    <TrackView
      tracks={props.tracks}
      onTrackActionClick={props.onAddTrackClick}
      clickElement={<AddIcon className={styles.addTrackButton} />}
    />
  );
};

export default SearchTrackView;
