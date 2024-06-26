import React from 'react';

import useAppendProcess from '../../hooks/useAppendProcess';
import { PrimaryButton } from '../shared/PrimaryButton';
import { PasskeyAppendedIcon } from '../shared/icons/PasskeyAppendedIcon';

const AppendSuccessScreen = () => {
  const { config } = useAppendProcess();
  return (
    <div className='cb-append-benefits-container'>
      <div className='cb-h2'>Success!</div>
      <div className='cb-append-benefits-icons'>
        <PasskeyAppendedIcon />
      </div>
      <div className='cb-p'>You can now use your fingerprint, face or PIN to log in.</div>
      <PrimaryButton onClick={() => void config.onComplete('')}>Continue</PrimaryButton>
    </div>
  );
};

export default AppendSuccessScreen;
