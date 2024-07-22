import { PasskeyChallengeCancelledError, PasskeyLoginSource } from '@corbado/web-core';
import log from 'loglevel';
import React, { useCallback, useState } from 'react';

import useLoginProcess from '../../hooks/useLoginProcess';
import useShared from '../../hooks/useShared';
import { LoginScreenType } from '../../types/screenTypes';
import { FaceIdIcon } from '../shared/icons/FaceIdIcon';
import { FingerprintIcon } from '../shared/icons/FingerprintIcon';
import { PasskeyLoginIcon } from '../shared/icons/PasskeyLoginIcon';
import { LinkButton } from '../shared/LinkButton';
import { PrimaryButton } from '../shared/PrimaryButton';

const LoginErrorScreenSoft = () => {
  const { config, navigateToScreen, currentIdentifier } = useLoginProcess();
  const { getConnectService } = useShared();
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(async () => {
    setLoading(true);

    const res = await getConnectService().login(currentIdentifier, PasskeyLoginSource.ErrorSoft);
    if (res.err) {
      setLoading(false);
      if (res.val.ignore) {
        return;
      }

      if (res.val instanceof PasskeyChallengeCancelledError) {
        config.onError?.('PasskeyChallengeAborted');
        navigateToScreen(LoginScreenType.ErrorHard);
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
      <div className='cb-h2'>Use your passkey to confirm it’s really you!</div>
      <div className='cb-login-error-soft-icons'>
        <FingerprintIcon platform='default' />
        <FaceIdIcon platform='default' />
        <PasskeyLoginIcon />
      </div>
      <div className='cb-p'>Your device will ask you or your fingerprint, face or screen lock.</div>
      <PrimaryButton
        onClick={() => void handleSubmit()}
        isLoading={loading}
        className='cb-login-error-soft-button'
      >
        Login with passkey
      </PrimaryButton>
      <LinkButton
        onClick={handleFallback}
        className='cb-login-error-soft-fallback'
      >
        Use password instead
      </LinkButton>
    </>
  );
};

export default LoginErrorScreenSoft;
