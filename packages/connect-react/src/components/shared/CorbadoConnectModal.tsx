import type { FC } from 'react';
import React from 'react';

import useModal from '../../hooks/useModal';

const CorbadoConnectModal: FC = () => {
  const { isModalVisible, children } = useModal();

  if (!isModalVisible) {
    return <></>;
  }

  return (
    <div className='cb-connect light'>
      <div className='cb-connect-custom-style'>
        <div className='cb-modal-outer'>
          <div className='cb-modal-outer-background'></div>
          <div className='cb-modal-outer-content'>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default CorbadoConnectModal;
