import React from 'react';

type Props = {
  message: string;
};

const PasskeyEmptyList = ({ message }: Props) => {
  return <div className='cb-passkey-list-empty'>{message}</div>;
};

export default PasskeyEmptyList;
