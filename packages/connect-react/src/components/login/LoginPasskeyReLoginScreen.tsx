import { PasskeyChallengeCancelledError, PasskeyLoginSource } from '@corbado/web-core';
import log from 'loglevel';
import React, { useCallback, useEffect, useState } from 'react';

import useLoginProcess from '../../hooks/useLoginProcess';
import useShared from '../../hooks/useShared';
import { LoginScreenType } from '../../types/screenTypes';
import { LinkButton } from '../shared/LinkButton';
import { PasskeyButton } from '../shared/PasskeyButton';

export const LoginPasskeyReLoginScreen = () => {
  const { config, navigateToScreen, setCurrentIdentifier, currentIdentifier } = useLoginProcess();
  const { getConnectService } = useShared();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const lastLogin = getConnectService().getLastLogin();

    if (!lastLogin?.identifierValue) {
      beginNewLogin();
      return;
    }

    setCurrentIdentifier(lastLogin.identifierValue);
  }, [getConnectService]);

  const handleSubmit = useCallback(async () => {
    setLoading(true);

    const res = await getConnectService().login(currentIdentifier, PasskeyLoginSource.OneTap);
    if (res.err) {
      setLoading(false);
      if (res.val.ignore) {
        return;
      }

      if (res.val instanceof PasskeyChallengeCancelledError) {
        config.onError?.('PasskeyChallengeAborted');
        navigateToScreen(LoginScreenType.ErrorSoft);
        return;
      }

      log.debug('login not allowed');
      config.onError?.('PasskeyLoginFailure');
      beginNewLogin();

      return;
    }

    setLoading(false);

    if (config.successTimeout) {
      navigateToScreen(LoginScreenType.Success);
      config.onSuccess?.();
      setTimeout(() => config.onComplete(res.val.session), config.successTimeout);

      return;
    }

    config.onComplete(res.val.session);
  }, [getConnectService, config, currentIdentifier]);

  const beginNewLogin = useCallback(() => {
    getConnectService().clearLastLogin();
    navigateToScreen(LoginScreenType.Init, { showFallback: true });
  }, [navigateToScreen, getConnectService]);

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
          onClick={() => beginNewLogin()}
          className='cb-switch'
        >
          Switch Account
        </LinkButton>
      </div>
    </>
  );
};
