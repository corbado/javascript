import { PasskeyChallengeCancelledError } from '@corbado/web-core';
import log from 'loglevel';
import React, { useCallback, useEffect, useState } from 'react';

import useLoginProcess from '../../hooks/useLoginProcess';
import useShared from '../../hooks/useShared';
import { LoginScreenType } from '../../types/screenTypes';
import { LinkButton } from '../shared/LinkButton';
import { PasskeyButton } from '../shared/PasskeyButton';

export const LoginPasskeyScreen = () => {
  const { config, navigateToScreen, setCurrentIdentifier, currentIdentifier } = useLoginProcess();
  const { getConnectService } = useShared();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const lastLogin = getConnectService().getLastLogin();

    if (!lastLogin?.identifierValue) {
      handleFallback();
      return;
    }

    setCurrentIdentifier(lastLogin.identifierValue);
  }, [getConnectService]);

  const handleSubmit = useCallback(async () => {
    setLoading(true);

    const res = await getConnectService().login(currentIdentifier);
    if (res.err) {
      setLoading(false);
      if (res.val.ignore) {
        return;
      }

      if (res.val instanceof PasskeyChallengeCancelledError) {
        navigateToScreen(LoginScreenType.ErrorHard);
        return;
      }

      log.debug('login not allowed');
      handleFallback();

      return;
    }

    setLoading(false);
    config.onComplete(res.val.session);
  }, [getConnectService, config, currentIdentifier]);

  const handleFallback = useCallback(() => {
    navigateToScreen(LoginScreenType.Init);
    getConnectService().clearLastLogin();
  }, [navigateToScreen, getConnectService]);

  return (
    <div className='cb-login-init-passkey-button'>
      <PasskeyButton
        email={currentIdentifier}
        onClick={() => void handleSubmit()}
        isLoading={loading}
      />

      <LinkButton
        onClick={() => handleFallback()}
        className='cb-switch'
      >
        Switch Account
      </LinkButton>
    </div>
  );
};
