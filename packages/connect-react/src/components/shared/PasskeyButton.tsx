import React from 'react';

import { Button } from './Button';
import { ArrowRight } from './icons/ArrowRight';
import { PasskeyLoginIcon } from './icons/PasskeyLoginIcon';
import { LoadingSpinner } from './LoadingSpinner';

export type Props = {
  email: string;
  onClick: () => void;
  isLoading?: boolean;
};

export const PasskeyButton = ({ email, isLoading }: Props) => {
  return (
    <Button className='cb-passkey-button'>
      <PasskeyLoginIcon className='cb-passkey-button-icon' />
      <div className='cb-passkey-button-content'>
        <div className='cb-passkey-button-title'>Login with passkey</div>
        <div className='cb-passkey-button-subtitle'>{email}</div>
      </div>

      {isLoading ? <LoadingSpinner /> : <ArrowRight className='cb-passkey-button-arrow' />}
    </Button>
  );
};
