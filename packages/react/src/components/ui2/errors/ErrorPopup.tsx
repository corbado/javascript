import type { CorbadoError } from '@corbado/web-core';
import React from 'react';

import { DeveloperError } from './DeveloperError';
import { UserError } from './UserError';

type Props = {
  isDevMode: boolean;
  error: CorbadoError;
  customerSupportEmail?: string;
};

const ErrorPopup = ({ isDevMode, error, customerSupportEmail }: Props) => {
  if (isDevMode) {
    return <UserError customerSupportEmail={customerSupportEmail} />;
  }

  return <DeveloperError error={error} />;
};

export default ErrorPopup;
