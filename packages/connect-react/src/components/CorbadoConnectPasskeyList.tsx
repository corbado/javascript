import type { CorbadoConnectPasskeyListConfig } from '@corbado/types';
import type { FC } from 'react';
import React from 'react';

import ManageProcessProvider from '../contexts/ManageProcessProvider';
import { ManageScreenType } from '../types/screenTypes';
import CorbadoConnectPasskeyListContainer from './passkeyList/CorbadoConnectPasskeyListContainer';

const CorbadoConnectPasskeyList: FC<CorbadoConnectPasskeyListConfig> = config => {
  return (
    <div className='light'>
      <div className='cb-connect-container cb-connect-passkey-list'>
        <ManageProcessProvider
          config={config}
          initialScreenType={ManageScreenType.Init}
        >
          <CorbadoConnectPasskeyListContainer />
        </ManageProcessProvider>
      </div>
    </div>
  );
};

export default CorbadoConnectPasskeyList;
