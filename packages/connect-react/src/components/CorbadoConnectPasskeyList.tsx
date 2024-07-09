import type { FC } from 'react';
import React from 'react';

import CorbadoConnectPasskeyListContainer from './CorbadoConnectPasskeyListContainer';
import ManageProcessProvider from '../contexts/ManageProcessProvider';
import { ManageScreenType } from '../types/screenTypes';
import { CorbadoConnectPasskeyListConfig } from '@corbado/types';

const CorbadoConnectPasskeyList: FC<CorbadoConnectPasskeyListConfig> = config => {
  return (
    <div className='light cb-width-full'>
      <div className='cb-connect-container cb-width-full'>
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
