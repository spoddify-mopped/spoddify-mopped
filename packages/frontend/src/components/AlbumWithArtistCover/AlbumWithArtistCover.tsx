import { Album } from '../../clients/api.types';
import Cover from '../Cover/Cover';
import React from 'react';
import styles from './AlbumWithArtistCover.module.scss';

type Props = {
  item: Album;
  onAlbumClick: (id: string) => void;
  onArtistClick: (id: string) => void;
};

const AlbumWithArtistCover = ({
  item,
  onAlbumClick,
  onArtistClick,
}: Props): React.ReactElement => {
  const renderArtistSubtitle = () => {
    return item.artists.map((artist, index) => (
      <>
        <span
          className={styles.artist}
          onClick={() => onArtistClick(artist.id)}
        >
          {artist.name}
        </span>
        {index !== item.artists.length - 1 ? ', ' : ''}
      </>
    ));
  };

  return (
    <Cover
      item={{
        clickableSubtitle: true,
        id: item.id,
        image: item.imageUrl,
        name: item.name,
        onClick: () => {
          onAlbumClick(item.id);
        },
        subtitle: renderArtistSubtitle(),
      }}
    />
  );
};

export default AlbumWithArtistCover;
