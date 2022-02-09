import { Album } from '../../clients/api.types';
import Cover from '../Cover/Cover';
import React from 'react';

type Props = {
  item: Album;
  onClick: (id: string) => void;
};

const AlbumCover = ({ item, onClick }: Props): React.ReactElement => {
  return (
    <Cover
      item={{
        id: item.id,
        image: item.imageUrl,
        name: item.name,
        onClick: () => {
          onClick(item.id);
        },
        subtitle: <span>{new Date(item.releaseDate || '').getFullYear()}</span>,
      }}
    />
  );
};

export default AlbumCover;
