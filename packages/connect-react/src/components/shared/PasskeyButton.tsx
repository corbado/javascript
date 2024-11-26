import type { FormEvent } from 'react';
import React from 'react';

import { Button } from './Button';
import { ArrowRight } from './icons/ArrowRight';
import { PasskeyLoginIcon } from './icons/PasskeyLoginIcon';
import { LoadingSpinner } from './LoadingSpinner';

export type Props = {
  identifier: string;
  onClick: () => void;
  isLoading?: boolean;
};

export const PasskeyButton = ({ identifier, isLoading, onClick }: Props) => {
  let shortenedIdentifier = identifier;
  if (identifier.length > 20 && identifier.includes('@')) {
    const splits = identifier.split('@');
    shortenedIdentifier = `${splits[0].slice(0, 10)}...@${splits[1]}`;
  }

  return (
    <Button
      className='cb-passkey-button'
      onClick={(e: FormEvent) => {
        e.preventDefault();
        onClick();
      }}
    >
      <PasskeyLoginIcon className='cb-passkey-button-icon' />
      <div className='cb-passkey-button-content'>
        <div className='cb-passkey-button-title'>Login with passkey</div>
        <div
          className='cb-passkey-button-subtitle'
          title={identifier}
        >
          {shortenedIdentifier}
        </div>
      </div>

      {isLoading ? <LoadingSpinner /> : <ArrowRight className='cb-passkey-button-arrow' />}
    </Button>
  );
};
