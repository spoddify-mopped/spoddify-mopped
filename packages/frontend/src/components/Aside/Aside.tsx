import React, { ReactElement } from 'react';

import { ReactComponent as Logo } from '../../resources/logo.svg';
import styles from './Aside.module.scss';

export type AsideItem = {
  name: string;
  image: ReactElement;
};

type Props = {
  items: AsideItem[];
  onItemClick?: (item: string) => void;
  active: string;
};

const Aside = ({ items, onItemClick, active }: Props): ReactElement => {
  const renderAsideItems = () =>
    items.map((item) => (
      <span
        key={`Aside_item_${item.name}`}
        onClick={() => onItemClick && onItemClick(item.name)}
        className={`${styles.entry} ${
          item.name === active ? styles.activeEntry : ''
        }`}
      >
        {item.image}
        <span>{item.name}</span>
      </span>
    ));

  return (
    <aside className={`${styles.menu}`}>
      <div>
        <div className={styles.header}>
          <Logo className={styles.logo} />
        </div>
        <div className={styles.entryContainer}>{renderAsideItems()}</div>
      </div>
    </aside>
  );
};

export default Aside;
