import { Album } from '../../clients/api.types';
import Cover from '../Cover/Cover';
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
        <Cover item={item} onClick={props.onItemClick} />
      ))}
    </div>
  );
};

export default ArtistsAlbumsPreview;
