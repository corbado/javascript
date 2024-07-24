import type { CorbadoConnectPasskeyListConfig } from '@corbado/types';
import type { FC } from 'react';
import React from 'react';

import ManageProcessProvider from '../contexts/ManageProcessProvider';
import { ManageScreenType } from '../types/screenTypes';
import CorbadoConnectPasskeyListContainer from './CorbadoConnectPasskeyListContainer';

const CorbadoConnectPasskeyList: FC<CorbadoConnectPasskeyListConfig> = config => {
  return (
    <div className='cb-connect-container'>
      <ManageProcessProvider
        config={config}
        initialScreenType={ManageScreenType.Init}
      >
        <CorbadoConnectPasskeyListContainer />
      </ManageProcessProvider>
    </div>
  );
};

export default CorbadoConnectPasskeyList;
