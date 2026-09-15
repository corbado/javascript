import type { CorbadoConnectPasskeyListConfig } from '@corbado/types';
import type { FC } from 'react';
import React, { useRef } from 'react';

import ManageProcessProvider from '../contexts/ManageProcessProvider';
import { ManageScreenType } from '../types/screenTypes';
import CorbadoConnectPasskeyListContainer from './passkeyList/CorbadoConnectPasskeyListContainer';

const CorbadoConnectPasskeyList: FC<CorbadoConnectPasskeyListConfig> = config => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className='cb-connect-container cb-connect-passkey-list'
      ref={containerRef}
    >
      <ManageProcessProvider
        config={config}
        initialScreenType={ManageScreenType.Init}
        containerRef={containerRef}
      >
        <CorbadoConnectPasskeyListContainer />
      </ManageProcessProvider>
    </div>
  );
};

export default CorbadoConnectPasskeyList;
