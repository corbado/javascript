import type { ConnectError } from '@corbado/web-core';
import { ConnectErrorType, PasskeyLoginSource } from '@corbado/web-core';
import log from 'loglevel';
import React, { useEffect, useMemo, useState } from 'react';

import useLoginProcess from '../../hooks/useLoginProcess';
import useShared from '../../hooks/useShared';
import { LoginScreenType } from '../../types/screenTypes';
import { getLoginErrorMessage, LoginSituationCode } from '../../types/situations';
import { withLowEventWindow } from '../../utils/lowEventWindow';
import LoginOneTap from './base/LoginOneTap';
import {
  type CboApiFallbackOperationError,
  connectLoginFinishToComplete,
  connectLoginFinishToWebauthnId,
} from './LoginInitScreen';

export const LoginPasskeyReLoginScreen = () => {
  const { config, navigateToScreen, setCurrentIdentifier, currentIdentifier, loadedMs, fallback, flags } =
    useLoginProcess();
  const { getConnectService } = useShared();
  const [loading, setLoading] = useState(false);
  const enableEventLow = useMemo(() => flags?.hasSupportForEventLow() ?? false, [flags]);

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
      return handleSituation(LoginSituationCode.CboApiNotAvailablePreAuthenticator, resStart.val);
    }

    if (resStart.val.assertionOptions.length === 0) {
      const data = {
        initFallback: resStart.val.fallbackOperationError.initFallback,
        identifierFallback: resStart.val.fallbackOperationError.identifier ?? '',
        message: resStart.val.fallbackOperationError.error?.message ?? null,
      };

      return handleSituation(LoginSituationCode.CboApiFallbackOperationError, undefined, data);
    }

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
      if (resFinish.val.type === ConnectErrorType.Cancel || resFinish.val.type === ConnectErrorType.Untyped) {
        return handleSituation(LoginSituationCode.ClientPasskeyOperationCancelled, resFinish.val);
      }

      return handleSituation(LoginSituationCode.CboApiNotAvailablePostAuthenticator, resFinish.val);
    }

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

  const beginNewLogin = (identifier: string) => {
    getConnectService().clearLastLogin();
    navigateToScreen(LoginScreenType.Init, { prefilledIdentifier: identifier });
  };

  const handleSituation = (situationCode: LoginSituationCode, error?: ConnectError, data?: unknown) => {
    const messageCode = `situation: ${situationCode} ${error?.track()}`;
    log.debug(messageCode);

    const identifier = currentIdentifier;
    const message = getLoginErrorMessage(situationCode);

    switch (situationCode) {
      case LoginSituationCode.CtApiNotAvailablePostAuthenticator:
      case LoginSituationCode.CboApiNotAvailablePostAuthenticator:
      case LoginSituationCode.CboApiNotAvailablePreAuthenticator:
        navigateToScreen(LoginScreenType.Invisible);
        fallback(identifier, message);
        void getConnectService().recordEventLoginErrorUnexpected(messageCode);

        setLoading(false);
        break;
      case LoginSituationCode.ClientPasskeyOperationCancelled:
        navigateToScreen(LoginScreenType.ErrorSoft);
        config.onError?.(situationCode.toString());
        void getConnectService().recordEventLoginError(messageCode);

        setLoading(false);
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
    <LoginOneTap
      loading={loading}
      handleSubmit={() => void handleSubmit()}
      currentIdentifier={currentIdentifier}
      handleSwitch={() => {
        void getConnectService().recordEventLoginOneTapSwitch();
        beginNewLogin(currentIdentifier);
      }}
    />
  );
};
