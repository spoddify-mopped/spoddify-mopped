import { Album, Artist } from '../../clients/api.types';
import React, { ReactElement } from 'react';

import AlbumWithArtistCover from '../AlbumWithArtistCover/AlbumWithArtistCover';
import ArtistCover from '../ArtistCover/ArtistCover';
import styles from './SearchCoverView.module.scss';

interface Props {
  items: Album[] | Artist[];
  onCoverClick?: (id: string) => void;
  onSubTitleClick?: (id: string) => void;
}

const SearchCoverView = (props: Props): ReactElement => {
  const renderItems = () => {
    return props.items.map((item) => {
      if ('artists' in item) {
        return (
          <AlbumWithArtistCover
            key={`albumWithArtistCover_${item.name}`}
            item={item}
            onAlbumClick={(id) => props.onCoverClick && props.onCoverClick(id)}
            onArtistClick={(id) =>
              props.onSubTitleClick && props.onSubTitleClick(id)
            }
          />
        );
      }

      return (
        <ArtistCover
          key={`artistCover${item.name}`}
          item={item}
          onClick={(id) => props.onCoverClick && props.onCoverClick(id)}
        />
      );
    });
  };

  return <div className={styles.container}>{renderItems()}</div>;
};

export default SearchCoverView;
