import React from 'react';

import { FaceIdIcon } from '../../shared/icons/FaceIdIcon';
import { FingerprintIcon } from '../../shared/icons/FingerprintIcon';
import { PasskeyLoginIcon } from '../../shared/icons/PasskeyLoginIcon';
import { LinkButton } from '../../shared/LinkButton';
import { PrimaryButton } from '../../shared/PrimaryButton';

type Props = {
  loading: boolean;
  handleSubmit: () => void;
  handleExplicitFallback: () => void;
};

const LoginErrorSoft = ({ loading, handleExplicitFallback, handleSubmit }: Props) => {
  return (
    <>
      <div className='cb-h2'>Use your passkey to confirm it’s really you!</div>
      <div className='cb-login-error-soft-icons'>
        <FingerprintIcon platform='default' />
        <FaceIdIcon platform='default' />
        <PasskeyLoginIcon />
      </div>
      <div className='cb-p'>Your device will ask you or your fingerprint, face or screen lock.</div>
      <PrimaryButton
        onClick={handleSubmit}
        isLoading={loading}
        className='cb-login-error-soft-button'
      >
        Login with passkey
      </PrimaryButton>
      <LinkButton
        onClick={handleExplicitFallback}
        className='cb-login-error-soft-fallback'
      >
        Use password instead
      </LinkButton>
    </>
  );
};

export default LoginErrorSoft;
