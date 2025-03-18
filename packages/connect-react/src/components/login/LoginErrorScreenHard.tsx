import { PasskeyChallengeCancelledError, PasskeyLoginSource } from '@corbado/web-core';
import log from 'loglevel';
import React, { useState } from 'react';

import useLoginProcess from '../../hooks/useLoginProcess';
import useShared from '../../hooks/useShared';
import { LoginScreenType } from '../../types/screenTypes';
import { getLoginErrorMessage, LoginSituationCode } from '../../types/situations';
import LoginErrorHard from './base/LoginErrorHard';
import { type CboApiFallbackOperationError, connectLoginFinishToComplete } from './LoginInitScreen';

type Props = {
  previousAssertionOptions: string;
};

const LoginErrorScreenHard = ({ previousAssertionOptions }: Props) => {
  const { config, navigateToScreen, currentIdentifier, loadedMs, fallback } = useLoginProcess();
  const { getConnectService } = useShared();
  const [loading, setLoading] = useState(false);
  const [hardErrorCount, setHardErrorCount] = useState(1);
  // only for logging purposes
  const [assertionOptions, setAssertionOptions] = useState<string | undefined>(previousAssertionOptions);

  const handleSubmit = async () => {
    if (loading) {
      return;
    }

    setLoading(true);
    const resStart = await getConnectService().loginStart(currentIdentifier, PasskeyLoginSource.ErrorHard, loadedMs);
    if (resStart.err) {
      return handleSituation(LoginSituationCode.CboApiNotAvailablePreAuthenticator);
    }

    if (resStart.val.assertionOptions.length === 0) {
      const data: CboApiFallbackOperationError = {
        initFallback: resStart.val.fallbackOperationError.initFallback,
        identifierFallback: resStart.val.fallbackOperationError.identifier ?? '',
        message: resStart.val.fallbackOperationError.error?.message ?? null,
      };

      return handleSituation(LoginSituationCode.CboApiFallbackOperationError, data);
    }

    setAssertionOptions(resStart.val.assertionOptions);

    const resFinish = await getConnectService().loginContinue(resStart.val);
    if (resFinish.err) {
      if (resFinish.val instanceof PasskeyChallengeCancelledError) {
        if (hardErrorCount >= 3) {
          return handleSituation(LoginSituationCode.ClientPasskeyOperationCancelledTooManyTimes);
        }

        return handleSituation(LoginSituationCode.ClientPasskeyOperationCancelled);
      }

      return handleSituation(LoginSituationCode.CboApiNotAvailablePostAuthenticator);
    }

    setLoading(false);

    try {
      await config.onComplete(connectLoginFinishToComplete(resFinish.val), getConnectService().encodeClientState());
    } catch {
      return handleSituation(LoginSituationCode.CtApiNotAvailablePostAuthenticator);
    }
  };

  const handleSituation = (situationCode: LoginSituationCode, data?: unknown) => {
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
      case LoginSituationCode.ClientPasskeyOperationCancelledTooManyTimes:
        navigateToScreen(LoginScreenType.Invisible);
        fallback(identifier, message);
        void getConnectService().recordEventLoginError(messageCode);

        setLoading(false);
        break;

      case LoginSituationCode.ClientPasskeyOperationCancelled:
        setHardErrorCount(hardErrorCount + 1);
        void getConnectService().recordEventLoginError(messageCode);

        setLoading(false);
        break;
      case LoginSituationCode.ExplicitFallbackByUser:
        navigateToScreen(LoginScreenType.Invisible);
        fallback(identifier, null);

        void getConnectService().recordEventLoginExplicitAbort(assertionOptions);
        break;
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
    <LoginErrorHard
      loading={loading}
      handleSubmit={() => void handleSubmit()}
      handleExplicitFallback={() => handleSituation(LoginSituationCode.ExplicitFallbackByUser)}
      handleNeedHelp={config.onHelpClick ? () => config.onHelpClick?.() : undefined}
    />
  );
};

export default LoginErrorScreenHard;
