import React, { ReactElement } from 'react';

import { ReactComponent as AddImage } from '../../resources/add.svg';
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
      clickElement={<AddImage className={styles.addTrackButton} />}
    />
  );
};

export default SearchTrackView;
