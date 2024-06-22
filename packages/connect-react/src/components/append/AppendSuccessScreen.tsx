import React from 'react';
import { PrimaryButton } from '../shared/PrimaryButton';
import useAppendProcess from '../../hooks/useAppendProcess';

const AppendSuccessScreen = () => {
  const { config } = useAppendProcess();
  return (
    <div className='cb-append-benefits-container'>
      <div className='cb-h2'>Success!</div>
      <div className='cb-p'>You can now use your fingerprint, face or PIN to log in.</div>
      <PrimaryButton onClick={() => void config.onComplete('')}>Continue</PrimaryButton>
    </div>
  );
};

export default AppendSuccessScreen;
