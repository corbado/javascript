import React, { useCallback, useState } from 'react';

import useLoginProcess from '../../hooks/useLoginProcess';
import useShared from '../../hooks/useShared';
import { LoginScreenType } from '../../types/screenTypes';
import { LinkButton } from '../shared/LinkButton';
import { PrimaryButton } from '../shared/PrimaryButton';
import Checkbox from '../shared/Checkbox';
import { PasskeyAddIcon } from '../shared/icons/PasskeyAddIcon';
import { LockIcon } from '../shared/icons/LockIcon';

const AppendAfterHybridLoginScreen = () => {
  const { config, navigateToScreen, currentIdentifier } = useLoginProcess();
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [loading, _] = useState(false);
  const { getConnectService } = useShared();

  const handleFallback = useCallback(() => {
    navigateToScreen(LoginScreenType.Invisible);
    config.onFallback(currentIdentifier);
  }, [navigateToScreen, config, currentIdentifier]);

  const handleExplicitFallback = useCallback(() => {
    void getConnectService().recordEventLoginExplicitAbort();
    handleFallback();
  }, [getConnectService, handleFallback]);

  const handleSubmit = useCallback(async () => {}, [
    getConnectService,
    config,
    navigateToScreen,
    currentIdentifier,
    loading,
  ]);

  const toggleDontShowAgain = () => setDontShowAgain(prev => !prev);

  return (
    <div className='cb-append-after-hybrid-login-container'>
      <div className='cb-h1'>Add a passkey to this device</div>
      <div className='cb-append-after-hybrid-login-icons'>
        <PasskeyAddIcon className='cb-append-after-hybrid-login-icon' />
      </div>
      <div className='cb-append-after-hybrid-login-content'>
        <LockIcon className='cb-append-after-hybrid-login-lock-icon' />
        <div className='cb-p'>Add a passkey on this device in order to not require any other devices for login</div>
      </div>
      <Checkbox
        label={"Don't show this again"}
        checked={dontShowAgain}
        onChange={toggleDontShowAgain}
      />
      <div className='cb-append-after-hybrid-login-cta'>
        <PrimaryButton
          isLoading={loading}
          onClick={() => void handleSubmit()}
          className='cb-append-after-hybrid-login-button'
        >
          Add new passkey
        </PrimaryButton>
        <LinkButton
          onClick={handleExplicitFallback}
          className='cb-append-after-hybrid-login-fallback'
        >
          Continue without new passkey
        </LinkButton>
      </div>
    </div>
  );
};

export default AppendAfterHybridLoginScreen;
