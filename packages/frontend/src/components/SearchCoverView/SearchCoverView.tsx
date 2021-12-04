import './SearchCoverView.css';

import { Album, Artist } from '../../clients/api.types';
import React, { ReactElement } from 'react';

interface Props {
  items: Album[] | Artist[];
  onCoverClick?: (id: string) => void;
}

const SearchCoverView = (props: Props): ReactElement => {
  const renderItems = () => {
    return props.items.map((item) => (
      <div
        className="coverViewEntry"
        onClick={() => props.onCoverClick && props.onCoverClick(item.id)}
      >
        {item.imageUrl ? (
          <img alt="" src={item.imageUrl} />
        ) : (
          <div className="coverViewImgReplacement"></div>
        )}
        {'artists' in item ? (
          <span>{item.artists.map((artist) => artist.name).join(', ')}</span>
        ) : undefined}
        <span title={item.name}>{item.name}</span>
      </div>
    ));
  };

  return <div className="searchCoverViewContainer">{renderItems()}</div>;
};

export default SearchCoverView;
