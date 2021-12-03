import './Modal.css';

import React, { PropsWithChildren, ReactElement } from 'react';

interface Props {
  visible?: boolean;
  onClose?: () => void;
}

export const Modal = (props: PropsWithChildren<Props>): ReactElement => {
  if (!props.visible) {
    return <></>;
  }

  return (
    <div className="modalContainer">
      <div className="modalCard">
        <div className="modalHeader">
          {props.onClose ? (
            <span
              className="modalCloseButton"
              onClick={(): void => props.onClose && props.onClose()}
            >
              X
            </span>
          ) : (
            <></>
          )}
        </div>
        <div className="modalCardContent">{props.children}</div>
      </div>
    </div>
  );
};
