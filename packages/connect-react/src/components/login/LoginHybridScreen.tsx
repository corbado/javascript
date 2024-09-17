import { PasskeyChallengeCancelledError } from '@corbado/web-core';
import log from 'loglevel';
import React, { useCallback, useState } from 'react';

import useLoginProcess from '../../hooks/useLoginProcess';
import useShared from '../../hooks/useShared';
import { LoginScreenType } from '../../types/screenTypes';
import { getLoginErrorMessage, LoginSituationCode } from '../../types/situations';
import { HybridIcon } from '../shared/icons/HybridIcon';
import { LinkButton } from '../shared/LinkButton';
import { PrimaryButton } from '../shared/PrimaryButton';
import { ConnectLoginStartRsp } from '@corbado/web-core/dist/api/v2';

const LoginHybridScreen = (resStart: ConnectLoginStartRsp) => {
  const { config, navigateToScreen, currentIdentifier } = useLoginProcess();
  const [loading, setLoading] = useState(false);
  const { getConnectService } = useShared();

  const handleSubmit = useCallback(async () => {
    if (loading) {
      return;
    }

    setLoading(true);
    const res = await getConnectService().loginContinue(resStart);
    if (res.err) {
      if (res.val instanceof PasskeyChallengeCancelledError) {
        return handleSituation(LoginSituationCode.ClientPasskeyOperationCancelled);
      }

      return handleSituation(LoginSituationCode.CboApiNotAvailablePostAuthenticator);
    }

    try {
      await config.onComplete(res.val.session);
    } catch {
      return handleSituation(LoginSituationCode.CtApiNotAvailablePostAuthenticator);
    }
  }, [getConnectService, config, navigateToScreen, currentIdentifier, loading]);

  const handleSituation = (situationCode: LoginSituationCode) => {
    log.debug(`situation: ${situationCode}`);

    const identifier = currentIdentifier;
    const message = getLoginErrorMessage(situationCode);

    switch (situationCode) {
      case LoginSituationCode.CtApiNotAvailablePostAuthenticator:
      case LoginSituationCode.CboApiNotAvailablePostAuthenticator:
        navigateToScreen(LoginScreenType.Invisible);
        config.onFallback(identifier, message);
        void getConnectService().recordEventLoginErrorUntyped();

        setLoading(false);
        break;
      case LoginSituationCode.ClientPasskeyOperationCancelled:
        navigateToScreen(LoginScreenType.ErrorSoft);
        config.onError?.(situationCode.toString());
        void getConnectService().recordEventLoginError();

        setLoading(false);
        break;
      case LoginSituationCode.ExplicitFallbackByUser:
        navigateToScreen(LoginScreenType.Invisible);
        config.onFallback(identifier, message);

        void getConnectService().recordEventLoginExplicitAbort();
        break;
    }
  };

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
          onClick={() => handleSituation(LoginSituationCode.ExplicitFallbackByUser)}
          className='cb-login-hybrid-fallback'
        >
          Continue with email
        </LinkButton>
      </div>
    </div>
  );
};

export default LoginHybridScreen;
