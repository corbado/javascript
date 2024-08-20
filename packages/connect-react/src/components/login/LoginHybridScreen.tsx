import type { CorbadoError } from '@corbado/web-core';
import { ConnectRequestTimedOut, PasskeyChallengeCancelledError } from '@corbado/web-core';
import type { ConnectLoginStartRsp } from '@corbado/web-core/dist/api/v2';
import log from 'loglevel';
import React, { useCallback, useState } from 'react';
import type { Result } from 'ts-results';

import useLoginProcess from '../../hooks/useLoginProcess';
import useShared from '../../hooks/useShared';
import { LoginScreenType } from '../../types/screenTypes';
import { HybridIcon } from '../shared/icons/HybridIcon';
import { LinkButton } from '../shared/LinkButton';
import { PrimaryButton } from '../shared/PrimaryButton';

const LoginHybridScreen = (resStart: Result<ConnectLoginStartRsp, CorbadoError>) => {
  const { config, navigateToScreen, currentIdentifier } = useLoginProcess();
  const [loading, setLoading] = useState(false);
  const { getConnectService } = useShared();

  const handleFallback = useCallback(() => {
    navigateToScreen(LoginScreenType.Invisible);
    config.onFallback(currentIdentifier);
  }, [navigateToScreen, config, currentIdentifier]);

  const handleExplicitFallback = useCallback(() => {
    void getConnectService().recordEventLoginExplicitAbort();
    handleFallback();
  }, [getConnectService, handleFallback]);

  const handleSubmit = useCallback(async () => {
    if (loading) {
      return;
    }

    setLoading(true);

    const res = await getConnectService().loginContinue(resStart);

    if (res.err) {
      setLoading(false);

      if (res.val instanceof ConnectRequestTimedOut) {
        handleFallback();
      }

      if (res.val.ignore) {
        return;
      }

      if (res.val instanceof PasskeyChallengeCancelledError) {
        config.onError?.('PasskeyChallengeAborted');
        navigateToScreen(LoginScreenType.ErrorSoft);
        void getConnectService().recordEventLoginError();
        return;
      }

      log.debug('fallback: error during password login start');
      config.onError?.('PasskeyLoginFailure');
      void getConnectService().recordEventLoginError();
      navigateToScreen(LoginScreenType.Invisible);
      config.onFallback(currentIdentifier);

      return;
    }

    config.onComplete(res.val.session);
  }, [getConnectService, config, navigateToScreen, currentIdentifier, loading]);

  return (
    <div className='cb-login-hybrid-container'>
      <div className='cb-h2'>Login with a mobile passkey</div>
      <div className='cb-p'>A passkey was found on your mobile device.</div>
      <div className='cb-login-hybrid-icons'>
        <HybridIcon className='cb-login-hybrid-icon' />
      </div>
      <div className='cb-p'>Use your mobile device to log in.</div>
      <div className='cb-p'>You can use your mobile device to log in. Simply scan the QR code.</div>
      <div className='cb-login-hybrid-cta'>
        <PrimaryButton
          isLoading={loading}
          onClick={() => void handleSubmit()}
          className='cb-login-hybrid-button'
        >
          Use mobile device
        </PrimaryButton>
        <LinkButton
          onClick={handleExplicitFallback}
          className='cb-login-hybrid-fallback'
        >
          Continue with email
        </LinkButton>
      </div>
    </div>
  );
};

export default LoginHybridScreen;
