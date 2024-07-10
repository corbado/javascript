import React, { FC, ReactNode } from 'react';
import ReactDOM from 'react-dom';

interface ModalProps {
  isVisible: boolean;
  children: ReactNode;
}

export const Modal: FC<ModalProps> = ({ isVisible, children }) => {
  if (!isVisible) return <></>;

  return ReactDOM.createPortal(
    <div className='cb-modal'>
      <div className='cb-modal__background'></div>
      <div className='cb-modal__content'>{children}</div>
    </div>,
    document.body,
  );
};
