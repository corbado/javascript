import type { FC } from 'react';
import React from 'react';

import { CircleExlamationIcon } from '../ui/icons/Icons';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: FC<ErrorMessageProps> = ({ message }) => (
  <div className='cb-error-message-2'>
    <div className='cb-error-icon-2'>
      <CircleExlamationIcon className='cb-error-icon-2' />
    </div>
    <div>{message}</div>
  </div>
);

export default ErrorMessage;
