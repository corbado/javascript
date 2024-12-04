import React from 'react';

import { PasskeyAppendIcon } from '../../shared/icons/PasskeyAppendIcon';
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
      <div className='cb-login-error-soft-container cb-connect-login-border'>
        <div className='cb-login-header'>
          <div className='cb-h2 cb-bold'>Use your passkey to confirm it’s really you</div>
        </div>
        <div className='cb-login-error-soft-icons'>
          <PasskeyAppendIcon />
        </div>
        <div className='cb-p cb-login-error-soft-text'>
          Your device will ask you for your fingerprint, face or screen lock.
        </div>
        <PrimaryButton
          onClick={handleSubmit}
          isLoading={loading}
          className='cb-login-error-soft-button'
        >
          Continue
        </PrimaryButton>
        <LinkButton
          onClick={handleExplicitFallback}
          className='cb-login-error-soft-fallback'
        >
          Use password instead
        </LinkButton>
      </div>
    </>
  );
};

export default LoginErrorSoft;
