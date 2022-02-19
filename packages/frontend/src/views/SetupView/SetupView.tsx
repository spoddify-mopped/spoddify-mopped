import React from 'react';
import qs from 'qs';
import styles from './SetupView.module.scss';

const BASE_URL = process.env.REACT_APP_API_URL || window.location.origin;

const loginUrl = () => {
  const query = qs.stringify({
    // eslint-disable-next-line camelcase
    redirect_uri: window.location.origin,
  });

  return `${BASE_URL}/api/auth?${query}`;
};

const SetupView = (): React.ReactElement => {
  return (
    <div className={styles.setup}>
      <span
        className={styles.loginButton}
        onClick={() => {
          window.location.replace(loginUrl());
        }}
      >
        Login
      </span>
    </div>
  );
};

export default SetupView;
