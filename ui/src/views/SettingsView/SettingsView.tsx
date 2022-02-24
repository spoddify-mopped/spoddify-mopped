import React, { useEffect, useState } from 'react';

import ApiClient from '../../clients/api';
import { SpotifydStatus } from '../../clients/api.types';
import styles from './SettingsView.module.scss';

const SettingsView = (): React.ReactElement => {
  const [spotifydStatus, setSpotifydStatus] = useState<
    SpotifydStatus | undefined
  >(undefined);

  useEffect(() => {
    ApiClient.getSpotifydStatus().then(setSpotifydStatus);
  }, []);

  return (
    <div className={styles.container}>
      <span className={styles.title}>Settings</span>
      <div className={styles.innerContainer}>
        <span className={styles.subtitle}>SpotifyD</span>

        <span className={styles.status}>
          Status: {spotifydStatus?.isRunning ? 'Running' : 'Stopped'}
        </span>

        <span>If you face playback problems, restart the player.</span>
        <div className={styles.spotifydControls}>
          <button
            className={`${styles.button} ${styles.green}`}
            onClick={async () => await ApiClient.restartSpotifyd()}
          >
            Restart
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
