import type { FC } from 'react';
import React from 'react';

import { SecondaryButton } from '../shared/SecondaryButton';

interface Props {
  onClick: () => void;
}

const AppendBenefitsScreen: FC<Props> = ({ onClick }) => {
  return (
    <div className='cb-append-benefits-container'>
      <div className='cb-h2'>What is a Passkey?</div>
      <div className='cb-p'>
        Passkeys are a replacement for passwords that are designed to provide a more convenient, more secure,
        passwordless sign-in experience on websites and apps.
      </div>
      <div className='cb-p'>
        Passkeys allow users to log in without having to enter a username or password, or provide any additional
        authentication factor. This new technology aims to replace log in methods such as passwords.
      </div>
      <div className='cb-p'>
        When a user wants to sign in to a service like VicRoads that uses passkeys, their browser (chrome) or operating
        system (IOS, Android or Microsoft) will help them select and use the right passkey.
      </div>
      <div className='cb-h2'>Use biometrics or PIN to login</div>
      <div className='cb-p'>
        The experience is similar to how saved passwords work today. To make sure only the rightful owner can use a
        passkey, the system will ask them to unlock their device.
      </div>
      <div className='cb-p'>
        This may be performed with a biometric sensor (such as a fingerprint or facial recognition), PIN, pattern or
        QRcode.
      </div>
      <div className='cb-p'>
        To activate your passkey, you will have to log in again with email address and password and activate your
        passkey
      </div>
      <SecondaryButton onClick={onClick}>Back</SecondaryButton>
    </div>
  );
};

export default AppendBenefitsScreen;
