import { ConnectRequestTimedOut, PasskeyChallengeCancelledError, PasskeyLoginSource } from '@corbado/web-core';
import log from 'loglevel';
import React, { useCallback, useState } from 'react';

import useLoginProcess from '../../hooks/useLoginProcess';
import useShared from '../../hooks/useShared';
import { LoginScreenType } from '../../types/screenTypes';
import { Button } from '../shared/Button';
import { ErrorIcon } from '../shared/icons/ErrorIcon';
import { PasskeyIcon } from '../shared/icons/PasskeyIcon';
import { LinkButton } from '../shared/LinkButton';
import { PrimaryButton } from '../shared/PrimaryButton';

const LoginErrorScreenHard = () => {
  const { config, navigateToScreen, currentIdentifier, loadedMs } = useLoginProcess();
  const { getConnectService } = useShared();
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (loading) {
      return;
    }

    setLoading(true);

    const res = await getConnectService().login(currentIdentifier, PasskeyLoginSource.ErrorHard, loadedMs);
    if (res.err) {
      setLoading(false);
      if (res.val.ignore) {
        return;
      }

      if (res.val instanceof ConnectRequestTimedOut) {
        handleFallback();
        return;
      }

      if (res.val instanceof PasskeyChallengeCancelledError) {
        navigateToScreen(LoginScreenType.ErrorHard);
        void getConnectService().recordEventLoginError();
        config.onError?.('PasskeyChallengeAborted');
        return;
      }

      log.debug('login not allowed');
      void getConnectService().recordEventLoginError();
      handleFallback();

      return;
    }

    setLoading(false);

    try {
      await config.onComplete(res.val.session);
    } catch {
      handleFallback();
    }
  }, [getConnectService, config]);

  const handleFallback = useCallback(() => {
    navigateToScreen(LoginScreenType.Invisible);
    config.onFallback(currentIdentifier);
  }, [navigateToScreen, config, currentIdentifier]);

  const handleExplicitFallback = useCallback(() => {
    void getConnectService().recordEventLoginExplicitAbort();
    handleFallback();
  }, [getConnectService, handleFallback]);

  return (
    <>
      <div className='cb-h2'>Something went wrong</div>
      <div className='cb-login-error-hard-icons'>
        <PasskeyIcon />
        <ErrorIcon className='cb-login-error-hard-icons-error' />
      </div>
      <div className='cb-p'>Login with passkeys was not possible. Try again or skip the process for now.</div>

      {config.onSignupClick && (
        <LinkButton
          onClick={() => config.onSignupClick!()}
          className='cb-login-error-hard-help'
        >
          Need help ?
        </LinkButton>
      )}

      <div className='cb-login-error-hard-cta'>
        <Button
          onClick={handleExplicitFallback}
          className='cb-outline-button'
        >
          Skip passkey login
        </Button>
        <PrimaryButton
          onClick={() => void handleSubmit()}
          isLoading={loading}
        >
          Try again
        </PrimaryButton>
      </div>
    </>
  );
};

export default LoginErrorScreenHard;
