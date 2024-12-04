import React from 'react';

import { HybridIcon } from '../../shared/icons/HybridIcon';
import { LinkButton } from '../../shared/LinkButton';
import { PrimaryButton } from '../../shared/PrimaryButton';

type Props = {
  loading: boolean;
  handleSubmit: () => void;
  handleFallback: () => void;
};

const LoginHybrid = ({ loading, handleSubmit, handleFallback }: Props) => {
  return (
    <div className='cb-login-hybrid-container cb-connect-login-border'>
      <div className='cb-login-header'>
        <div className='cb-h2'>Login with a mobile passkey</div>
      </div>
      <div className='cb-p'>A passkey was found on your mobile device.</div>
      <div className='cb-login-hybrid-icons'>
        <HybridIcon className='cb-login-hybrid-icon' />
      </div>
      <div className='cb-p'>Scan the QR code with your mobile device to log in.</div>
      <div className='cb-login-hybrid-cta'>
        <PrimaryButton
          isLoading={loading}
          onClick={() => void handleSubmit()}
          className='cb-login-hybrid-button'
        >
          Use mobile device
        </PrimaryButton>
        <LinkButton
          onClick={handleFallback}
          className='cb-login-hybrid-fallback'
        >
          Continue with email
        </LinkButton>
      </div>
    </div>
  );
};

export default LoginHybrid;
