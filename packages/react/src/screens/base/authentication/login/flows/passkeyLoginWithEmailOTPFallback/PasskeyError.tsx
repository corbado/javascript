import React from 'react';

import { PasskeyError as PasskeyErrorBase } from '../../../../../components/wrappers/PasskeyError';

export const PasskeyError = () => {
  return (
    <PasskeyErrorBase
      showSecondaryButton={false}
      navigateBackOnCancel={false}
    />
  );
};
