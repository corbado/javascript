import type { FC } from 'react';
import React from 'react';

export interface PasskeyDeleteProps {
  passkeyId: string;
  onPasskeyDelete: (id: string) => Promise<void>;
}

const PasskeyDelete: FC<PasskeyDeleteProps> = ({ passkeyId, onPasskeyDelete }) => {
  return (
    <div className='cb-passkey-list-icon'>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 24 24'
        className='cb-passkey-list-delete'
        onClick={() => void onPasskeyDelete(passkeyId)}
      >
        <path d='M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z' />
      </svg>
    </div>
  );
};

export default PasskeyDelete;
