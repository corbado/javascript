import { PasskeyChallengeCancelledError, PasskeyLoginSource } from '@corbado/web-core';
import log from 'loglevel';
import React, { useEffect, useState } from 'react';

import useLoginProcess from '../../hooks/useLoginProcess';
import useShared from '../../hooks/useShared';
import { LoginScreenType } from '../../types/screenTypes';
import { LoginSituationCode, getLoginErrorMessage } from '../../types/situations';
import { LinkButton } from '../shared/LinkButton';
import { PasskeyButton } from '../shared/PasskeyButton';

export const LoginPasskeyReLoginScreen = () => {
  const { config, navigateToScreen, setCurrentIdentifier, currentIdentifier, loadedMs } = useLoginProcess();
  const { getConnectService } = useShared();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const lastLogin = getConnectService().getLastLogin();
    if (!lastLogin?.identifierValue) {
      beginNewLogin('');
      return;
    }

    setCurrentIdentifier(lastLogin.identifierValue);
  }, [getConnectService]);

  const handleSubmit = async () => {
    setLoading(true);
    config.onLoginStart?.();
    const resStart = await getConnectService().loginStart(currentIdentifier, PasskeyLoginSource.OneTap, loadedMs);
    if (resStart.err) {
      return handleSituation(LoginSituationCode.CboApiNotAvailablePreAuthenticator);
    }

    const resFinish = await getConnectService().loginContinue(resStart.val);
    if (resFinish.err) {
      if (resFinish.val instanceof PasskeyChallengeCancelledError) {
        return handleSituation(LoginSituationCode.ClientPasskeyOperationCancelled);
      }

      return handleSituation(LoginSituationCode.CboApiNotAvailablePostAuthenticator);
    }

    try {
      await config.onComplete(resFinish.val.session);
    } catch {
      return handleSituation(LoginSituationCode.CtApiNotAvailablePostAuthenticator);
    }
  };

  const beginNewLogin = (identifier: string) => {
    getConnectService().clearLastLogin();
    navigateToScreen(LoginScreenType.Init, { prefilledIdentifier: identifier });
  };

  const handleSituation = (situationCode: LoginSituationCode) => {
    log.debug(`situation: ${situationCode}`);

    const identifier = currentIdentifier;
    const message = getLoginErrorMessage(situationCode);

    switch (situationCode) {
      case LoginSituationCode.CtApiNotAvailablePostAuthenticator:
      case LoginSituationCode.CboApiNotAvailablePostAuthenticator:
      case LoginSituationCode.CboApiNotAvailablePreAuthenticator:
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
    }
  };

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
