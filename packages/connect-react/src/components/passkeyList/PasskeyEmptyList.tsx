import React from 'react';

type Props = {
  message: string;
};

const PasskeyEmptyList = ({ message }: Props) => {
  return (
    <div className='cb-passkey-list-empty'>
      <p>{message}</p>
    </div>
  );
};

export default PasskeyEmptyList;
