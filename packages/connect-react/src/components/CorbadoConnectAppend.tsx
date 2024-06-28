import type { CorbadoConnectAppendConfig } from '@corbado/types';
import type { FC } from 'react';
import React from 'react';

import AppendProcessProvider from '../contexts/AppendProcessProvider';
import { AppendScreenType } from '../types/ScreenType';
import CorbadoConnectAppendContainer from './CorbadoConnectAppendContainer';

const CorbadoConnectAppend: FC<CorbadoConnectAppendConfig> = (config: CorbadoConnectAppendConfig) => {
  return (
    <div className='light'>
      <div className='cb-connect-container cb-connect-append'>
        <AppendProcessProvider
          config={config}
          initialScreenType={AppendScreenType.Init}
        >
          <CorbadoConnectAppendContainer />
        </AppendProcessProvider>
      </div>
    </div>
  );
};

export default CorbadoConnectAppend;
