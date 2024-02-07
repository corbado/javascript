import { useCorbado } from '@corbado/react-sdk';
import React from 'react';

import { PasskeyErrorBase } from '../../../../../../components';

export const PasskeyError = () => {
  const { isAuthenticated } = useCorbado();

  return (
    <PasskeyErrorBase
      showSecondaryButton={!isAuthenticated}
      navigateBackOnCancel={!isAuthenticated}
    />
  );
};
