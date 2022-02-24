import { Artist } from '../../clients/api.types';
import React from 'react';
import styles from './ArtistsTitle.module.scss';

type Props = {
  artists: Artist[];
  className?: string;
  onArtistClick: (id: string) => void;
};

function ArtistsTitle({
  artists,
  className,
  onArtistClick,
}: Props): React.ReactElement {
  const artistCount = artists.length;

  return (
    <span className={className}>
      {artists.map((artist, index) => (
        <span key={`artist_${artist.name}_${index}`}>
          <span
            className={styles.link}
            key={artist.id}
            onClick={() => onArtistClick(artist.id)}
          >
            {artist.name}
          </span>
          <span>{index === artistCount - 1 ? ' ' : ', '}</span>
        </span>
      ))}
    </span>
  );
}

export default ArtistsTitle;
