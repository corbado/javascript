import { ConnectError, ConnectErrorType, PasskeyLoginSource } from '@corbado/web-core';
import log from 'loglevel';
import React, { useState } from 'react';

import useLoginProcess from '../../hooks/useLoginProcess';
import useShared from '../../hooks/useShared';
import { LoginScreenType } from '../../types/screenTypes';
import { getLoginErrorMessage, LoginSituationCode } from '../../types/situations';
import LoginErrorSoft from './base/LoginErrorSoft';
import type { CboApiFallbackOperationError } from './LoginInitScreen';
import { connectLoginFinishToComplete } from './LoginInitScreen';

type Props = {
  previousAssertionOptions: string;
};

const LoginErrorScreenSoft = ({ previousAssertionOptions }: Props) => {
  const { config, navigateToScreen, currentIdentifier, loadedMs, fallback } = useLoginProcess();
  const { getConnectService } = useShared();
  const [loading, setLoading] = useState(false);
  // only for logging purposes

  const handleSubmit = async () => {
    if (loading) {
      return;
    }

    setLoading(true);
    const resStart = await getConnectService().loginStart(currentIdentifier, PasskeyLoginSource.ErrorSoft, loadedMs);
    if (resStart.err) {
      return handleSituation(LoginSituationCode.CboApiNotAvailablePreAuthenticator, resStart.val);
    }

    if (resStart.val.assertionOptions.length === 0) {
      const data: CboApiFallbackOperationError = {
        initFallback: resStart.val.fallbackOperationError.initFallback,
        identifierFallback: resStart.val.fallbackOperationError.identifier ?? '',
        message: resStart.val.fallbackOperationError.error?.message ?? null,
      };

      return handleSituation(LoginSituationCode.CboApiFallbackOperationError, undefined, data);
    }

    const resFinish = await getConnectService().loginContinue(resStart.val);
    if (resFinish.err) {
      if (resFinish.val.type === ConnectErrorType.Cancel) {
        return handleSituation(
          LoginSituationCode.ClientPasskeyOperationCancelled,
          resFinish.val,
          resStart.val.assertionOptions,
        );
      }

      return handleSituation(LoginSituationCode.CboApiNotAvailablePostAuthenticator, resFinish.val);
    }

    try {
      await config.onComplete(connectLoginFinishToComplete(resFinish.val), getConnectService().encodeClientState());
      setLoading(false);
    } catch {
      handleSituation(LoginSituationCode.CtApiNotAvailablePostAuthenticator);
    }
  };

  const handleSituation = (situationCode: LoginSituationCode, error?: ConnectError, data?: unknown) => {
    const messageCode = `situation: ${situationCode} ${error?.track()}`;
    log.debug(messageCode);

    const identifier = currentIdentifier;
    const message = getLoginErrorMessage(situationCode);

    switch (situationCode) {
      case LoginSituationCode.CboApiNotAvailablePreAuthenticator:
      case LoginSituationCode.CtApiNotAvailablePostAuthenticator:
      case LoginSituationCode.CboApiNotAvailablePostAuthenticator:
        navigateToScreen(LoginScreenType.Invisible);
        fallback(identifier, message);
        void getConnectService().recordEventLoginErrorUnexpected(messageCode);

        setLoading(false);
        break;
      case LoginSituationCode.ClientPasskeyOperationCancelled: {
        const assertionOptions = data as string;
        navigateToScreen(LoginScreenType.ErrorHard, { previousAssertionOptions: assertionOptions });
        config.onError?.(situationCode.toString());
        void getConnectService().recordEventLoginError(messageCode);

        setLoading(false);
        break;
      }
      case LoginSituationCode.ExplicitFallbackByUser: {
        navigateToScreen(LoginScreenType.Invisible);
        fallback(identifier, null);

        void getConnectService().recordEventLoginExplicitAbort(previousAssertionOptions);
        break;
      }
      case LoginSituationCode.CboApiFallbackOperationError: {
        const { initFallback, identifierFallback, message } = data as CboApiFallbackOperationError;
        if (initFallback) {
          navigateToScreen(LoginScreenType.Invisible);
          fallback(identifierFallback, message);
        }
        void getConnectService().recordEventLoginError(messageCode);

        setLoading(false);
        break;
      }
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
