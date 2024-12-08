import React from 'react';

import { PasskeyIssueIcon } from '../../shared/icons/PasskeyIssueIcon';
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
      <div className='cb-login-error-hard-container cb-connect-login-border'>
        <div className='cb-login-header'>
          <div className='cb-h2 cb-bold'>Something went wrong!</div>
        </div>
        <div className='cb-login-error-hard-icons'>
          <PasskeyIssueIcon />
        </div>
        <div className='cb-p cb-login-error-hard-text'>Login with passkeys was not possible.</div>
        <PrimaryButton
          onClick={handleSubmit}
          isLoading={loading}
          className='cb-login-error-hard-button'
        >
          Try again
        </PrimaryButton>
        <OutlineButton
          className='cb-login-error-hard-fallback'
          onClick={handleExplicitFallback}
        >
          Skip passkey login
        </OutlineButton>
        {handleNeedHelp && (
          <>
            <div className='cb-divider'></div>
            <LinkButton
              onClick={() => handleNeedHelp()}
              className='cb-login-error-hard-button-help'
            >
              Need help ?
            </LinkButton>
          </>
        )}
      </div>
    </>
  );
};

export default LoginErrorHard;
