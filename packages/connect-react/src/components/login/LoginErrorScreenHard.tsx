import { PasskeyChallengeCancelledError } from '@corbado/web-core';
import log from 'loglevel';
import React, { useCallback } from 'react';

import useLoginProcess from '../../hooks/useLoginProcess';
import useShared from '../../hooks/useShared';
import { LoginScreenType } from '../../types/screenTypes';
import { PasskeyIcon } from '../shared/icons/PasskeyIcon';
import { LinkButton } from '../shared/LinkButton';
import { PrimaryButton } from '../shared/PrimaryButton';
import { ErrorIcon } from '../shared/icons/ErrorIcon';
import { Button } from '../shared/Button';
import { ConnectLoginStates } from '../../types/states';

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
        config.onStateChange?.(ConnectLoginStates.HardError);
        return;
      }

      log.debug('login not allowed');
      handleFallback();

      return;
    }

    if (config.successTimeout) {
      navigateToScreen(LoginScreenType.Success);
      config.onStateChange?.(ConnectLoginStates.Success);
      setTimeout(() => config.onComplete(res.val.session), config.successTimeout);

      return;
    }

    config.onComplete(res.val.session);
  }, [getConnectService, config]);

  const handleFallback = useCallback(() => {
    navigateToScreen(LoginScreenType.Invisible);
    config.onStateChange?.(ConnectLoginStates.Fallback);
    config.onFallback(currentIdentifier);
  }, [navigateToScreen, config, currentIdentifier]);

  return (
    <>
      <div className='cb-h2'>Something went wrong</div>
      <div className='cb-login-error-hard-icons'>
        <PasskeyIcon />
        <ErrorIcon className='cb-login-error-hard-icons-error' />
      </div>
      <div className='cb-p'>Login with passkeys was not possible. Try again or skip the process for now.</div>

      <LinkButton onClick={() => {}}>Need help ?</LinkButton>

      <div className='cb-login-error-hard-cta'>
        <Button
          onClick={handleFallback}
          className='cb-outline-button'
        >
          Skip passkey login
        </Button>
        <PrimaryButton onClick={() => void handleSubmit()}>Try again</PrimaryButton>
      </div>
    </>
  );
};

export default LoginErrorScreenHard;
