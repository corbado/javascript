import { PasskeyChallengeCancelledError, PasskeyLoginSource } from '@corbado/web-core';
import log from 'loglevel';
import React, { useState } from 'react';

import useLoginProcess from '../../hooks/useLoginProcess';
import useShared from '../../hooks/useShared';
import { LoginScreenType } from '../../types/screenTypes';
import { getLoginErrorMessage, LoginSituationCode } from '../../types/situations';
import LoginErrorSoft from './base/LoginErrorSoft';
import { connectLoginFinishToComplete } from './LoginInitScreen';

const LoginErrorScreenSoft = () => {
  const { config, navigateToScreen, currentIdentifier, loadedMs, fallback } = useLoginProcess();
  const { getConnectService } = useShared();
  const [loading, setLoading] = useState(false);
  // only for logging purposes
  const [assertionOptions, setAssertionOptions] = useState<string | undefined>();

  const handleSubmit = async () => {
    if (loading) {
      return;
    }

    setLoading(true);
    const resStart = await getConnectService().loginStart(currentIdentifier, PasskeyLoginSource.ErrorSoft, loadedMs);
    if (resStart.err) {
      return handleSituation(LoginSituationCode.CboApiNotAvailablePreAuthenticator);
    }

    setAssertionOptions(resStart.val.assertionOptions);

    const resFinish = await getConnectService().loginContinue(resStart.val);
    if (resFinish.err) {
      if (resFinish.val instanceof PasskeyChallengeCancelledError) {
        return handleSituation(LoginSituationCode.ClientPasskeyOperationCancelled);
      }

      return handleSituation(LoginSituationCode.CboApiNotAvailablePostAuthenticator);
    }

    try {
      await config.onComplete(connectLoginFinishToComplete(resFinish.val));
      setLoading(false);
    } catch {
      handleSituation(LoginSituationCode.CtApiNotAvailablePostAuthenticator);
    }
  };

  const handleSituation = (situationCode: LoginSituationCode) => {
    const messageCode = `situation: ${situationCode}`;
    log.debug(messageCode);

    const identifier = currentIdentifier;
    const message = getLoginErrorMessage(situationCode);

    switch (situationCode) {
      case LoginSituationCode.CtApiNotAvailablePostAuthenticator:
      case LoginSituationCode.CboApiNotAvailablePostAuthenticator:
        navigateToScreen(LoginScreenType.Invisible);
        fallback(identifier, message);
        void getConnectService().recordEventLoginErrorUnexpected(messageCode);

        setLoading(false);
        break;
      case LoginSituationCode.ClientPasskeyOperationCancelled:
        navigateToScreen(LoginScreenType.ErrorHard);
        config.onError?.(situationCode.toString());
        void getConnectService().recordEventLoginError(messageCode);

        setLoading(false);
        break;
      case LoginSituationCode.ExplicitFallbackByUser:
        navigateToScreen(LoginScreenType.Invisible);
        fallback(identifier, null);

        void getConnectService().recordEventLoginExplicitAbort(assertionOptions);
        break;
    }
  };

  return (
    <LoginErrorSoft
      loading={loading}
      handleSubmit={() => void handleSubmit()}
      handleExplicitFallback={() => handleSituation(LoginSituationCode.ExplicitFallbackByUser)}
    />
  );
};

export default LoginErrorScreenSoft;
