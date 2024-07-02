import { PasskeyChallengeCancelledError } from '@corbado/web-core';
import log from 'loglevel';
import React, { useCallback, useState } from 'react';

import useLoginProcess from '../../hooks/useLoginProcess';
import useShared from '../../hooks/useShared';
import { LoginScreenType } from '../../types/screenTypes';
import { FaceIdIcon } from '../shared/icons/FaceIdIcon';
import { FingerprintIcon } from '../shared/icons/FingerprintIcon';
import { LinkButton } from '../shared/LinkButton';
import { PrimaryButton } from '../shared/PrimaryButton';

const LoginErrorScreenSoft = () => {
  const { config, navigateToScreen, currentIdentifier } = useLoginProcess();
  const { getConnectService } = useShared();
  const [loading, setLoading] = useState(false);

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
      </div>
      <div className='cb-p'>Your device will ask you or your fingerprint, face or screen lock.</div>
      <PrimaryButton
        onClick={() => void handleSubmit()}
        isLoading={loading}
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
