import React, { ChangeEventHandler } from 'react';

import { ReactComponent as SearchIcon } from '../../resources/search.svg';
import styles from './SearchInput.module.scss';

type Props = {
  className?: string;
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onDeleteInputClick?: () => void;
};

const SearchInput = ({
  className,
  value,
  onChange,
  onDeleteInputClick,
}: Props): React.ReactElement => {
  return (
    <div className={`${styles.container} ${className || ''}`}>
      <SearchIcon className={styles.searchIcon} />
      <input
        className={styles.input}
        placeholder="Search"
        value={value}
        onChange={onChange}
      />
      {value !== '' ? (
        <span className={styles.delete} onClick={onDeleteInputClick}>
          X
        </span>
      ) : (
        <></>
      )}
    </div>
  );
};

export default SearchInput;
