import React, { useEffect, useState } from 'react';

import styles from './ProgressBar.module.scss';

let interval: NodeJS.Timeout;

export const parseMs = (
  timeInMs: number | string,
  format: 'hh:mm:ss' | 'hh:mm' | 'mm:ss'
): string => {
  if (typeof timeInMs === 'string') {
    timeInMs = parseInt(timeInMs, 10);
  }
  let seconds: string | number = Math.floor((timeInMs / 1000) % 60);
  let minutes: string | number = Math.floor((timeInMs / (1000 * 60)) % 60);
  let hours: string | number = Math.floor((timeInMs / (1000 * 60 * 60)) % 24);

  hours = hours < 10 ? `0${hours}` : hours;
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  seconds = seconds < 10 ? `0${seconds}` : seconds;

  if (format === 'hh:mm:ss') {
    return `${hours}:${minutes}:${seconds}`;
  }

  if (format === 'hh:mm') {
    return `${hours}:${minutes}`;
  }

  if (format === 'mm:ss') {
    return `${minutes}:${seconds}`;
  }
  return '';
};

type Props = {
  startProgress?: number;
  duration?: number;
  isPlaying?: boolean;
};

const ProgressBar = ({
  duration,
  startProgress,
  isPlaying,
}: Props): React.ReactElement => {
  const [progress, setProgress] = useState(startProgress || 0);

  useEffect(() => {
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(progress + 1000);
      }, 1000);
    } else {
      interval && clearInterval(interval);
    }
    return () => {
      interval && clearInterval(interval);
    };
  }, [progress, isPlaying]);

  useEffect(() => {
    setProgress(startProgress || 0);
  }, [startProgress]);

  return (
    <div className={styles.container}>
      <span className={styles.time}>{parseMs(progress, 'mm:ss')}</span>
      <div className={styles.progressBar}>
        <div
          className={styles.filledProgressBar}
          style={{
            width: `${(progress / (duration || 1)) * 100}%`,
          }}
        ></div>
      </div>
      <span className={styles.time}>{parseMs(duration || 0, 'mm:ss')}</span>
    </div>
  );
};

export default ProgressBar;
