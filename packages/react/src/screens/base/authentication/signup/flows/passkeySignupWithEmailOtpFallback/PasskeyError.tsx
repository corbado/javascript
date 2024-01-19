import { useCorbado } from '@corbado/react-sdk';
import React from 'react';

import { PasskeyErrorBase } from '../../../../../../components';

export const PasskeyError = () => {
  const { shortSession } = useCorbado();
  return (
    <PasskeyErrorBase
      showSecondaryButton={!shortSession}
      navigateBackOnCancel={!shortSession}
    />
  );
};
