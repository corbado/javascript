import type { ConnectError } from '@corbado/web-core';
import { ConnectErrorType } from '@corbado/web-core';
import type { ConnectLoginStartRsp } from '@corbado/web-core/dist/api/v2';
import log from 'loglevel';
import React, { useCallback, useMemo, useState } from 'react';

import useLoginProcess from '../../hooks/useLoginProcess';
import useShared from '../../hooks/useShared';
import { LoginScreenType } from '../../types/screenTypes';
import { getLoginErrorMessage, LoginSituationCode } from '../../types/situations';
import { withLowEventWindow } from '../../utils/lowEventWindow';
import LoginHybrid from './base/LoginHybrid';
import { connectLoginFinishToComplete, connectLoginFinishToWebauthnId } from './LoginInitScreen';

const LoginHybridScreen = (resStart: ConnectLoginStartRsp) => {
  const { config, navigateToScreen, currentIdentifier, fallback, flags } = useLoginProcess();
  const [loading, setLoading] = useState(false);
  const { getConnectService } = useShared();
  const enableEventLow = useMemo(() => flags?.hasSupportForEventLow() ?? false, [flags]);

  const handleSubmit = useCallback(async () => {
    if (loading) {
      return;
    }

    setLoading(true);
    const res = await withLowEventWindow(
      {
        connectService: getConnectService(),
        enabled: enableEventLow,
        startEventType: 'pl-start',
        finishEventType: 'pl-finish',
      },
      () => getConnectService().loginContinue(resStart),
    );
    if (res.err) {
      if (res.val.type === ConnectErrorType.Cancel || res.val.type === ConnectErrorType.Untyped) {
        return handleSituation(LoginSituationCode.ClientPasskeyOperationCancelled, res.val);
      }

      return handleSituation(LoginSituationCode.CboApiNotAvailablePostAuthenticator, res.val);
    }

    try {
      await config.onComplete(
        connectLoginFinishToComplete(res.val),
        getConnectService().encodeClientState(),
        connectLoginFinishToWebauthnId(res.val),
      );
    } catch {
      return handleSituation(LoginSituationCode.CtApiNotAvailablePostAuthenticator);
    }
  }, [getConnectService, config, navigateToScreen, currentIdentifier, loading, enableEventLow]);

  const handleSituation = (situationCode: LoginSituationCode, error?: ConnectError) => {
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
      case LoginSituationCode.ClientPasskeyOperationCancelled:
        navigateToScreen(LoginScreenType.ErrorSoft);
        config.onError?.(situationCode.toString());
        void getConnectService().recordEventLoginError(messageCode);

        setLoading(false);
        break;
      case LoginSituationCode.ExplicitFallbackByUser:
        navigateToScreen(LoginScreenType.Invisible);
        fallback(identifier, null);

        void getConnectService().recordEventLoginExplicitAbort(resStart.assertionOptions);
        break;
    }
  };

  return (
    <LoginHybrid
      loading={loading}
      handleSubmit={() => void handleSubmit()}
      handleFallback={() => handleSituation(LoginSituationCode.ExplicitFallbackByUser)}
    />
  );
};

export default LoginHybridScreen;
