import type { ConnectError } from '@corbado/web-core';
import { ConnectErrorType, PasskeyLoginSource } from '@corbado/web-core';
import log from 'loglevel';
import React, { useMemo, useState } from 'react';

import useLoginProcess from '../../hooks/useLoginProcess';
import useShared from '../../hooks/useShared';
import { LoginScreenType } from '../../types/screenTypes';
import { getLoginErrorMessage, LoginSituationCode } from '../../types/situations';
import { withLowEventWindow } from '../../utils/lowEventWindow';
import LoginErrorHard from './base/LoginErrorHard';
import {
  type CboApiFallbackOperationError,
  connectLoginFinishToComplete,
  connectLoginFinishToWebauthnId,
} from './LoginInitScreen';

type Props = {
  previousAssertionOptions: string;
};

const LoginErrorScreenHard = ({ previousAssertionOptions }: Props) => {
  const { config, navigateToScreen, currentIdentifier, loadedMs, fallback, flags } = useLoginProcess();
  const { getConnectService } = useShared();
  const [loading, setLoading] = useState(false);
  const [hardErrorCount, setHardErrorCount] = useState(1);
  const enableEventLow = useMemo(() => flags?.hasSupportForEventLow() ?? false, [flags]);
  // only for logging purposes
  const [assertionOptions, setAssertionOptions] = useState<string | undefined>(previousAssertionOptions);

  const handleSubmit = async () => {
    if (loading) {
      return;
    }

    setLoading(true);
    const resStart = await getConnectService().loginStart(currentIdentifier, PasskeyLoginSource.ErrorHard, loadedMs);
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

    setAssertionOptions(resStart.val.assertionOptions);

    const resFinish = await withLowEventWindow(
      {
        connectService: getConnectService(),
        enabled: enableEventLow,
        startEventType: 'pl-start',
        finishEventType: 'pl-finish',
      },
      () => getConnectService().loginContinue(resStart.val),
    );
    if (resFinish.err) {
      if (resFinish.val.type === ConnectErrorType.Cancel) {
        if (hardErrorCount >= 3) {
          return handleSituation(LoginSituationCode.ClientPasskeyOperationCancelledTooManyTimes, resFinish.val);
        }

        return handleSituation(LoginSituationCode.ClientPasskeyOperationCancelled, resFinish.val);
      }

      return handleSituation(LoginSituationCode.CboApiNotAvailablePostAuthenticator, resFinish.val);
    }

    setLoading(false);

    try {
      await config.onComplete(
        connectLoginFinishToComplete(resFinish.val),
        getConnectService().encodeClientState(),
        connectLoginFinishToWebauthnId(resFinish.val),
      );
    } catch {
      return handleSituation(LoginSituationCode.CtApiNotAvailablePostAuthenticator);
    }
  };

  const handleSituation = (situationCode: LoginSituationCode, error?: ConnectError, data?: unknown) => {
    const messageCode = `situation: ${situationCode} ${error?.track()}`;
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
