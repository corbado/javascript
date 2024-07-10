import React, { FC } from 'react';
import useModal from '../hooks/useModal';

const Modal: FC = () => {
  const { isModalVisible, children } = useModal();

  if (!isModalVisible) return <></>;

  return (
    <div className='cb-modal'>
      <div className='cb-modal__background'></div>
      <div className='cb-modal__content'>{children}</div>
    </div>
  );
};

export default Modal;
