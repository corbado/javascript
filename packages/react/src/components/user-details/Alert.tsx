import type { FC } from 'react';
import React from 'react';

import { Text } from '../ui';
import { AlertIcon } from '../ui/icons/AlertIcon';

interface Props {
  text: string;
  variant?: 'error' | 'info';
}

const Alert: FC<Props> = ({ text, variant = 'error' }) => {
  return (
    <div className='cb-user-details-alert-container'>
      <AlertIcon
        color={variant === 'error' ? 'error' : 'secondary'}
        className='cb-user-details-alert-icon'
      />
      <Text className={`cb-user-details-text${variant === 'error' ? ' cb-error-text-color' : ''}`}>{text}</Text>
    </div>
  );
};

export default Alert;
