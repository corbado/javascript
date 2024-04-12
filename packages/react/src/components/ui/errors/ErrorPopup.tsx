import type { CorbadoError } from '@corbado/web-core';
import React from 'react';

import { UserError } from './UserError';

type Props = {
  isDevMode: boolean;
  error: CorbadoError;
  customerSupportEmail?: string;
};

const ErrorPopup = ({ customerSupportEmail }: Props) => {
  return <UserError customerSupportEmail={customerSupportEmail} />;
};

export default ErrorPopup;