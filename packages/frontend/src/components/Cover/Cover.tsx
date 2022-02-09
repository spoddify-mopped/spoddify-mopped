import { Album, Artist } from '../../clients/api.types';

import React from 'react';
import styles from './Cover.module.scss';

type Props = {
  item: Album | Artist;
  onClick?: (id: string) => void;
};

const Cover = ({ onClick, item: entry }: Props): React.ReactElement => {
  return (
    <div className={styles.cover} onClick={() => onClick && onClick(entry.id)}>
      <img src={entry.imageUrl} alt="Thumb" />
      <span title={entry.name} className={styles.title}>
        {entry.name}
      </span>
    </div>
  );
};

export default Cover;
