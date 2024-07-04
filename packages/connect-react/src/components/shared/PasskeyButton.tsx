import React from 'react';

import { Button } from './Button';
import { PasskeyLoginIcon } from './icons/PasskeyLoginIcon';
import { ArrowRight } from './icons/ArrowRight';

export type Props = {
  email: string;
};

export const PasskeyButton = ({ email }: Props) => {
  return (
    <Button className='cb-passkey-button'>
      <PasskeyLoginIcon className='cb-passkey-button-icon' />
      <div className='cb-passkey-button-content'>
        <div className='cb-passkey-button-title'>Login with passkey</div>
        <div className='cb-passkey-button-subtitle'>{email}</div>
      </div>
      <ArrowRight className='cb-passkey-button-arrow' />
    </Button>
  );
};
