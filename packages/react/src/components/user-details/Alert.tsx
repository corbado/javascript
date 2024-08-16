import React, { FC } from 'react';
import { Text } from '../ui';
import { AlertIcon } from '../ui/icons/AlertIcon';

interface Props {
  text: string;
}

const Alert: FC<Props> = ({ text }) => {
  return (
    <div className='cb-user-details-alert-container'>
      <AlertIcon
        color='error'
        className='cb-user-details-alert-icon'
      />
      <Text className='cb-user-details-text cb-error-text-color'>{text}</Text>
    </div>
  );
};

export default Alert;
