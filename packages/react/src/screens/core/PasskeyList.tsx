import { useCorbado } from '@corbado/react-sdk';
import type { FC } from 'react';
import React from 'react';

import { PasskeyListBase, PasskeyListErrorBoundary } from '../../components';

const PasskeyList: FC = () => {
  const { globalError } = useCorbado();

  return (
    <PasskeyListErrorBoundary globalError={globalError}>
      <PasskeyListBase />
    </PasskeyListErrorBoundary>
  );
};

export default PasskeyList;
