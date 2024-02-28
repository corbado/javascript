import type { NonRecoverableError } from '@corbado/react-sdk';
import { useCorbado } from '@corbado/react-sdk';
import type { FC } from 'react';
import React, { useEffect, useState } from 'react';

import { PasskeyListBase, PasskeyListErrorBoundary } from '../../components';

const PasskeyList: FC = () => {
  const { globalError } = useCorbado();
  const [error, setError] = useState<NonRecoverableError>();

  useEffect(() => {
    if (!globalError || globalError.message === 'An unknown error occurred') {
      setError(undefined);
      return;
    }

    setError(globalError);
  }, [globalError]);

  return (
    <PasskeyListErrorBoundary globalError={error}>
      <PasskeyListBase />
    </PasskeyListErrorBoundary>
  );
};

export default PasskeyList;
