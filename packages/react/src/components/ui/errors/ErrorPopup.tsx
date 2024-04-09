import type { CorbadoError } from '@corbado/web-core';
import React from 'react';

import { UserError } from './UserError';

type Props = {
  isDevMode: boolean;
  error: CorbadoError;
  customerSupportEmail?: string;
};

const ErrorPopup = ({ customerSupportEmail, error }: Props) => {
  return (
    <UserError
      customerSupportEmail={customerSupportEmail}
      error={error}
    />
  );
};

export default ErrorPopup;
