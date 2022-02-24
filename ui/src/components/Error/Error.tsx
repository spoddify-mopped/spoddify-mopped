import React from 'react';
import styles from './Error.module.scss';

const Error = (): React.ReactElement => {
  return (
    <div className={styles.error}>
      <span>An error has occurred.</span>
      <span>Please try again later.</span>
    </div>
  );
};

export default Error;
