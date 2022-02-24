import { Album } from '../../clients/api.types';
import AlbumCover from '../AlbumCover/AlbumCover';
import React from 'react';
import styles from './ArtistsAlbumsPreview.module.scss';

type Props = {
  items: Album[];
  onItemClick?: (id: string) => void;
};

const ArtistsAlbumsPreview = (props: Props): React.ReactElement => {
  return (
    <div className={styles.container}>
      {props.items.map((item) => (
        <AlbumCover
          key={`albumCover_${item.name}`}
          item={item}
          onClick={() => {
            props.onItemClick && props.onItemClick(item.id);
          }}
        />
      ))}
    </div>
  );
};

export default ArtistsAlbumsPreview;
