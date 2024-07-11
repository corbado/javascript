import type { FC } from 'react';
import React from 'react';

import useModal from '../hooks/useModal';

const CorbadoConnectModal: FC = () => {
  const { isModalVisible, children } = useModal();

  if (!isModalVisible) {
    return <></>;
  }

  return (
    <div className='cb-modal'>
      <div className='cb-modal__background'></div>
      <div className='cb-modal__content'>{children}</div>
    </div>
  );
};

export default CorbadoConnectModal;
