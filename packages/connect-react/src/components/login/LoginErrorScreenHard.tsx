import { PasskeyChallengeCancelledError } from '@corbado/web-core';
import log from 'loglevel';
import React, { useCallback } from 'react';

import useLoginProcess from '../../hooks/useLoginProcess';
import { LoginScreenType } from '../../types/screenTypes';
import { PasskeyIcon } from '../shared/icons/PasskeyIcon';
import { LinkButton } from '../shared/LinkButton';
import { PrimaryButton } from '../shared/PrimaryButton';
import useShared from '../../hooks/useShared';

const LoginErrorScreenHard = () => {
  const { config, navigateToScreen, currentIdentifier } = useLoginProcess();
  const { getConnectService } = useShared();

  const handleSubmit = useCallback(async () => {
    const res = await getConnectService().login(currentIdentifier);
    if (res.err) {
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

    config.onComplete(res.val.session);
  }, [getConnectService, config]);

  const handleFallback = useCallback(() => {
    navigateToScreen(LoginScreenType.Invisible);
    config.onFallback(currentIdentifier);
  }, [navigateToScreen, config, currentIdentifier]);

  return (
    <>
      <div className='cb-h2'>Use your passkey to confirm it’s really you!</div>
      <div className='cb-login-error-hard-icons'>
        <PasskeyIcon />
      </div>
      <div className='cb-p'>Login with passkeys was not possible. Try again or skip the process for now.</div>
      <PrimaryButton onClick={handleFallback}>Skip passkey login</PrimaryButton>
      <LinkButton
        onClick={() => void handleSubmit()}
        className='cb-login-error-hard-fallback'
      >
        Try again
      </LinkButton>
    </>
  );
};

export default LoginErrorScreenHard;
