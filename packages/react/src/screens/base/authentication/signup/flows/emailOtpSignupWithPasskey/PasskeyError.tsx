import React from 'react';

import { PasskeyErrorBase } from '../../../../../../components';

export const PasskeyError = () => {
  return (
    <PasskeyErrorBase
      showSecondaryButton={false}
      navigateBackOnCancel={false}
    />
  );
};
