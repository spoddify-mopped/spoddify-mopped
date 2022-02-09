import React, { useRef } from 'react';

import styles from './Cover.module.scss';

type CoverItem = {
  clickableSubtitle?: boolean;
  id: string;
  name: string;
  image?: string;
  subtitle?: React.ReactElement | React.ReactElement[];
  onClick?: () => void;
};

type Props = {
  item: CoverItem;
  className?: string;
};

const Cover = ({ className, item }: Props): React.ReactElement => {
  const subtitle = useRef<HTMLSpanElement>(null);

  return (
    <div
      key={`cover_${item.id}_${item.name}`}
      className={`${styles.cover} ${className || ''}`}
      onClick={(evt) => {
        if (item.clickableSubtitle && subtitle.current) {
          const children = subtitle.current.children;
          for (let i = 0; i < children.length; i++) {
            if (evt.target === children[i]) {
              return;
            }
          }
        }

        item.onClick && item.onClick();
      }}
    >
      <img src={item.image} alt="Thumb" />
      <span title={item.name} className={styles.title}>
        {item.name}
      </span>
      <span ref={subtitle} className={`${styles.subtitle}`}>
        {item.subtitle}
      </span>
    </div>
  );
};

export default Cover;
