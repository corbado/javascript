import type { FC } from 'react';
import React from 'react';

import { CircleExclamationIcon } from '../icons/CircleExclamationIcon';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: FC<ErrorMessageProps> = ({ message }) => (
  <div className='cb-error-message'>
    <div className='cb-error-message-icon-container'>
      <CircleExclamationIcon className='cb-error-message-icon' />
    </div>
    <div className='cb-error-message-text'>{message}</div>
  </div>
);

export default ErrorMessage;
