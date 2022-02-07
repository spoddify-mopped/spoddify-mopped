import { DotPulse } from '../../components/DotPulse/DotPulse';
import React from 'react';
import styles from './FullLoadingView.module.scss';

const FullLoadingView = (): React.ReactElement => {
  return (
    <div className={styles.container}>
      <DotPulse color="white" />
    </div>
  );
};

export default FullLoadingView;
