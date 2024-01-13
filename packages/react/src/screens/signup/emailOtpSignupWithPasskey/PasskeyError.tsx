import React from 'react';

import { PasskeyError as PasskeyErrorBase } from '../../../components/signup/PasskeyError';

export const PasskeyError = () => {
  return (
    <PasskeyErrorBase
      showSecondaryButton={false}
      navigateBackOnCancel={false}
    />
  );
};
