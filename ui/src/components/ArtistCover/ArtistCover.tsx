import { Artist } from '../../clients/api.types';
import Cover from '../Cover/Cover';
import React from 'react';
import styles from './ArtistCover.module.scss';

type Props = {
  item: Artist;
  onClick: (id: string) => void;
};

const ArtistCover = ({ item, onClick }: Props): React.ReactElement => {
  return (
    <Cover
      className={styles.cover}
      item={{
        id: item.id,
        image: item.imageUrl,
        name: item.name,
        onClick: () => {
          onClick(item.id);
        },
      }}
    />
  );
};

export default ArtistCover;
