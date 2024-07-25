import { PasskeyChallengeCancelledError, PasskeyLoginSource } from '@corbado/web-core';
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
  const { config, navigateToScreen, currentIdentifier } = useLoginProcess();
  const { getConnectService } = useShared();
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (loading) {return;}

    setLoading(true);

    const res = await getConnectService().login(currentIdentifier, PasskeyLoginSource.ErrorHard);
    if (res.err) {
      setLoading(false);
      if (res.val.ignore) {
        return;
      }

      if (res.val instanceof PasskeyChallengeCancelledError) {
        navigateToScreen(LoginScreenType.ErrorHard);
        config.onError?.('PasskeyChallengeAborted');
        return;
      }

      log.debug('login not allowed');
      handleFallback();

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
  }, [getConnectService, config]);

  const handleFallback = useCallback(() => {
    navigateToScreen(LoginScreenType.Invisible);
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

      {config.onHelpRequest && (
        <LinkButton
          onClick={() => config.onHelpRequest!()}
          className='cb-login-error-hard-help'
        >
          Need help ?
        </LinkButton>
      )}

      <div className='cb-login-error-hard-cta'>
        <Button
          onClick={handleFallback}
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
