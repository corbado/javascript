import React, { useCallback } from 'react';

import useLoginProcess from '../../hooks/useLoginProcess';
import useShared from '../../hooks/useShared';
import { LoginScreenType } from '../../types/screenTypes';
import { LinkButton } from '../shared/LinkButton';
import { PrimaryButton } from '../shared/PrimaryButton';
import { HybridIcon } from '../shared/icons/HybridIcon';

const LoginHybridScreen = () => {
  const { config, navigateToScreen, currentIdentifier } = useLoginProcess();
  const { getConnectService } = useShared();

  const handleFallback = useCallback(() => {
    navigateToScreen(LoginScreenType.Invisible);
    config.onFallback(currentIdentifier);
  }, [navigateToScreen, config, currentIdentifier]);

  const handleExplicitFallback = useCallback(() => {
    getConnectService().recordEventLoginExplicitAbort();
    handleFallback();
  }, [getConnectService, handleFallback]);

  return (
    <div className='cb-login-hybrid-container'>
      <div className='cb-h1'>Login with a mobile passkey</div>
      <div className='cb-p'>A passkey was found on your mobile device.</div>
      <div className='cb-login-hybrid-icons'>
        <HybridIcon className='cb-login-hybrid-icon' />
      </div>
      <div className='cb-p'>Use your mobile device to log in.</div>
      <div className='cb-p'>You can use your mobile device to log in. Simply scan the QR code.</div>
      <div className='cb-login-hybrid-cta'>
        <PrimaryButton
          onClick={() => {}}
          className='cb-login-hybrid-button'
        >
          Use mobile device
        </PrimaryButton>
        <LinkButton
          onClick={handleExplicitFallback}
          className='cb-login-hybrid-fallback'
        >
          Continue with email
        </LinkButton>
      </div>
    </div>
  );
};

export default LoginHybridScreen;
