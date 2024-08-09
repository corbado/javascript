import React, { useCallback, useState } from 'react';

import log from 'loglevel';
import useShared from '../../hooks/useShared';
import { AppendScreenType } from '../../types/screenTypes';
import { LinkButton } from '../shared/LinkButton';
import { PrimaryButton } from '../shared/PrimaryButton';
import Checkbox from '../shared/Checkbox';
import { PasskeyAddIcon } from '../shared/icons/PasskeyAddIcon';
import { Notification } from '../shared/Notification';
import { LockIcon } from '../shared/icons/LockIcon';
import useAppendProcess from '../../hooks/useAppendProcess';

const AppendAfterHybridLoginScreen = (attestationOptions: string) => {
  const { config, navigateToScreen } = useAppendProcess();
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const { getConnectService } = useShared();

  const handleSubmit = useCallback(async () => {
    if (loading) return;

    setLoading(true);
    setError(undefined);

    const res = await getConnectService().completeAppend(attestationOptions);
    if (res.err) {
      log.error('error:', res.val);
      setLoading(false);
      setError('Passkey operation was cancelled or timed out.');

      return;
    }

    setLoading(false);
    navigateToScreen(AppendScreenType.Success);
  }, [getConnectService, config, navigateToScreen, loading]);

  const toggleDontShowAgain = () => setDontShowAgain(prev => !prev);

  return (
    <div className='cb-append-after-hybrid-login-container'>
      <div className='cb-h1'>Add a passkey to this device</div>
      {error ? (
        <Notification
          className='cb-error-notification'
          message={error}
        />
      ) : null}
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
          onClick={() => config.onSkip()}
          className='cb-append-after-hybrid-login-fallback'
        >
          Continue without new passkey
        </LinkButton>
      </div>
    </div>
  );
};

export default AppendAfterHybridLoginScreen;