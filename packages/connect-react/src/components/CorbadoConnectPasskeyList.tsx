import type { CorbadoConnectPasskeyListConfig } from '@corbado/types';
import type { FC } from 'react';
import React from 'react';

import CorbadoConnectPasskeyListContainer from './CorbadoConnectPasskeyListContainer';

const CorbadoConnectPasskeyList: FC<CorbadoConnectPasskeyListConfig> = () => {
  return (
    <div className='light'>
          <CorbadoConnectPasskeyListContainer />
    </div>
  );
};

export default CorbadoConnectPasskeyList;
