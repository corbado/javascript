import React from 'react';

import { ErrorIcon } from '../../shared/icons/ErrorIcon';
import { PasskeyIcon } from '../../shared/icons/PasskeyIcon';
import { LinkButton } from '../../shared/LinkButton';
import { OutlineButton } from '../../shared/OutlineButton';
import { PrimaryButton } from '../../shared/PrimaryButton';

type Props = {
  loading: boolean;
  handleSubmit: () => void;
  handleExplicitFallback: () => void;
  handleNeedHelp?: () => void;
};

const LoginErrorHard = ({ loading, handleExplicitFallback, handleSubmit, handleNeedHelp }: Props) => {
  return (
    <>
      <div className='cb-h2'>Something went wrong</div>
      <div className='cb-login-error-hard-icons'>
        <PasskeyIcon />
        <ErrorIcon className='cb-login-error-hard-icons-error' />
      </div>
      <div className='cb-p'>Login with passkeys was not possible. Try again or skip the process for now.</div>

      {handleNeedHelp && (
        <LinkButton
          onClick={() => handleNeedHelp()}
          className='cb-login-error-hard-help'
        >
          Need help ?
        </LinkButton>
      )}

      <div className='cb-login-error-hard-cta'>
        <OutlineButton onClick={handleExplicitFallback}>Skip passkey login</OutlineButton>
        <PrimaryButton
          onClick={handleSubmit}
          isLoading={loading}
        >
          Try again
        </PrimaryButton>
      </div>
    </>
  );
};

export default LoginErrorHard;
