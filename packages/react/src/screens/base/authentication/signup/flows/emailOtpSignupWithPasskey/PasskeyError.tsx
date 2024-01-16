import React from 'react';

import { PasskeyError as PasskeyErrorBase } from '../../../../../../components/authentication/PasskeyError';

export const PasskeyError = () => {
  return (
    <PasskeyErrorBase
      showSecondaryButton={false}
      navigateBackOnCancel={false}
    />
  );
};
