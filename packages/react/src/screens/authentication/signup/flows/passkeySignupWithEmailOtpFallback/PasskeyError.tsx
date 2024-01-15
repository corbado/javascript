import { useCorbado } from '@corbado/react-sdk';
import React from 'react';

import { PasskeyError as PasskeyErrorBase } from '../../../../../components/wrappers/PasskeyError';

export const PasskeyError = () => {
  const { shortSession } = useCorbado();
  return (
    <PasskeyErrorBase
      showSecondaryButton={!shortSession}
      navigateBackOnCancel={!shortSession}
    />
  );
};
