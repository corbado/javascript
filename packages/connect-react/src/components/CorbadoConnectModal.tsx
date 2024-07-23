import type { FC } from 'react';
import React from 'react';

import useModal from '../hooks/useModal';

const CorbadoConnectModal: FC = () => {
  const { isModalVisible, children } = useModal();

  if (!isModalVisible) {
    return <></>;
  }

  return (
    <div className='cb-modal light'>
      <div className='cb-modal-background'></div>
      <div className='cb-modal-content'>{children}</div>
    </div>
  );
};

export default CorbadoConnectModal;
