import { SpoddiyMoppedLogoWithName, SpotifyIcon } from '../../assets';

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
      <img
        className={styles.logo}
        src={SpoddiyMoppedLogoWithName}
        alt="Spoddify Mopped"
      />
      <span
        className={styles.loginButton}
        onClick={() => {
          window.location.replace(loginUrl());
        }}
      >
        <img className={styles.spotifyIcon} src={SpotifyIcon} alt="Spotify" />
        Login with Spotify
      </span>
    </div>
  );
};

export default SetupView;
