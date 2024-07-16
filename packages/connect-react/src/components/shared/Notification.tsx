import React from 'react';

import { CircleExclamationIcon } from './icons/CircleExclamationIcon';

type Props = {
  message: string;
  className?: string;
};

export const Notification: React.FC<Props> = ({ message, className }: Props) => {
  return (
    <div className={`cb-notification-container ${className}`}>
      <div className='cb-notification-icon'>
        <CircleExclamationIcon />
      </div>
      <div className='cb-notification-text'>{message}</div>
    </div>
  );
};
