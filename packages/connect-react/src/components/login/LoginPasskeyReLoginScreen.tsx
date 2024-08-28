import { ConnectRequestTimedOut, PasskeyChallengeCancelledError, PasskeyLoginSource } from '@corbado/web-core';
import log from 'loglevel';
import React, { useCallback, useEffect, useState } from 'react';

import useLoginProcess from '../../hooks/useLoginProcess';
import useShared from '../../hooks/useShared';
import { LoginScreenType } from '../../types/screenTypes';
import { LinkButton } from '../shared/LinkButton';
import { PasskeyButton } from '../shared/PasskeyButton';

export const LoginPasskeyReLoginScreen = () => {
  const { config, navigateToScreen, setCurrentIdentifier, currentIdentifier, loadedMs } = useLoginProcess();
  const { getConnectService } = useShared();
  const [loading, setLoading] = useState(false);

  const handleFallback = useCallback(() => {
    navigateToScreen(LoginScreenType.Invisible);
    config.onFallback(currentIdentifier);
  }, [navigateToScreen, config, currentIdentifier]);

  useEffect(() => {
    const lastLogin = getConnectService().getLastLogin();
    if (!lastLogin?.identifierValue) {
      beginNewLogin('');
      return;
    }

    setCurrentIdentifier(lastLogin.identifierValue);
  }, [getConnectService]);

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    config.onLoginStart?.();

    const res = await getConnectService().login(currentIdentifier, PasskeyLoginSource.OneTap, loadedMs);
    if (res.err) {
      setLoading(false);

      if (res.val instanceof ConnectRequestTimedOut) {
        handleFallback();
        return;
      }

      if (res.val.ignore) {
        return;
      }

      if (res.val instanceof PasskeyChallengeCancelledError) {
        config.onError?.('PasskeyChallengeAborted');
        void getConnectService().recordEventLoginError();
        navigateToScreen(LoginScreenType.ErrorSoft);
        return;
      }

      log.debug('login not allowed');
      config.onError?.('PasskeyLoginFailure');
      void getConnectService().recordEventLoginError();
      beginNewLogin(currentIdentifier);

      return;
    }

    try {
      await config.onComplete(res.val.session);
    } catch {
      handleFallback();
    }
  }, [getConnectService, config, currentIdentifier, loadedMs]);

  const beginNewLogin = useCallback(
    (identifier: string) => {
      getConnectService().clearLastLogin();
      navigateToScreen(LoginScreenType.Init, { prefilledIdentifier: identifier });
    },
    [navigateToScreen, getConnectService],
  );

  return (
    <>
      <div className='cb-h2'>Welcome back</div>

      <div className='cb-login-init-passkey-button'>
        <PasskeyButton
          email={currentIdentifier}
          onClick={() => void handleSubmit()}
          isLoading={loading}
        />

        <LinkButton
          onClick={() => {
            void getConnectService().recordEventLoginOneTapSwitch();
            beginNewLogin(currentIdentifier);
          }}
          className='cb-switch'
        >
          Switch Account
        </LinkButton>
      </div>
    </>
  );
};
