import { Album } from '../../clients/api.types';
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
        <div
          className={styles.entry}
          onClick={() => props.onItemClick && props.onItemClick(item.id)}
        >
          <img src={item.imageUrl} alt="Thumb" />
          <span title={item.name} className={styles.title}>
            {item.name}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ArtistsAlbumsPreview;
