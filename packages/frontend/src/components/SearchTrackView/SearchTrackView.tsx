import './SearchTrackView.css';

import React, { ReactElement } from 'react';

import { ReactComponent as AddImage } from '../../resources/add.svg';
import { Track } from '../../clients/api.types';

interface Props {
  tracks: Track[];
  onAddTrackClick: (track: Track) => void;
}

const SearchTrackView = (props: Props): ReactElement => {
  const renderTracks = () => {
    return props.tracks.map((track) => (
      <div className="trackSearchEntryContainer">
        <div className="trackSearchEntry">
          {track.imageUrl ? (
            <img alt="" src={track.imageUrl} />
          ) : (
            <div className="trackImgReplacement"></div>
          )}
          <div className="trackInfo">
            <span className="trackTitle" title={track.name}>
              {track.name}
            </span>
            <span>
              {track.artists.map((trackArtist) => trackArtist.name).join(', ')}
            </span>
          </div>
        </div>
        <AddImage
          className="addTrackButton"
          onClick={() => props.onAddTrackClick(track)}
        />
      </div>
    ));
  };

  return <div className="trackSearchViewContainer">{renderTracks()}</div>;
};

export default SearchTrackView;
