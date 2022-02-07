import './DotPulse.scss';

import React from 'react';

interface Props {
  color?: string;
}

export const DotPulse = (props: Props): React.ReactElement => {
  return (
    <div className="lds-ellipsis">
      <div style={{ backgroundColor: props.color }}></div>
      <div style={{ backgroundColor: props.color }}></div>
      <div style={{ backgroundColor: props.color }}></div>
      <div style={{ backgroundColor: props.color }}></div>
    </div>
  );
};
