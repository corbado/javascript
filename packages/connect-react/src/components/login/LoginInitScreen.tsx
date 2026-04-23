import type { ConnectError } from '@corbado/web-core';
import { base64decode, ConnectErrorType, PasskeyLoginSource } from '@corbado/web-core';
import type { ConnectLoginFinishRsp } from '@corbado/web-core/dist/api/v2';
import log from 'loglevel';
import type { FC } from 'react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import useLoginProcess from '../../hooks/useLoginProcess';
import useShared from '../../hooks/useShared';
import { Flags } from '../../types/flags';
import { LoginScreenType } from '../../types/screenTypes';
import { getLoginErrorMessage, LoginSituationCode } from '../../types/situations';
import { withLowEventWindow } from '../../utils/lowEventWindow';
import { StatefulLoader } from '../../utils/statefulLoader';
import LoginInitLoaded from './base/LoginInitLoaded';
import LoginInitLoading from './base/LoginInitLoading';

export type CboApiFallbackOperationError = {
  initFallback: boolean;
  identifierFallback: string;
  message: string | null;
  code?: string;
};

export enum LoginInitState {
  SilentLoading,
  Loading,
  Loaded,
}

interface Props {
  showFallback?: boolean;
  prefilledIdentifier?: string;
}

export const connectLoginFinishToComplete = (v: ConnectLoginFinishRsp): string => {
  if (v.session.length > 0) {
    return v.session;
  }

  return v.signedPasskeyData;
};

export const connectLoginFinishToWebauthnId = (v: ConnectLoginFinishRsp): string => {
  const parts = v.signedPasskeyData.split('.');
  const base64decoded = JSON.parse(base64decode(parts[1]));

  return base64decoded['webauthnId'];
};

const LoginInitScreen: FC<Props> = ({ showFallback = false }) => {
  const { config, navigateToScreen, setCurrentIdentifier, setFlags, flags, loadedMs, fallback } = useLoginProcess();
  const { sharedConfig, getConnectService } = useShared();
  const [cuiBasedLoading, setCuiBasedLoading] = useState(false);
  const [identifierBasedLoading, setIdentifierBasedLoading] = useState(false);
  const [error, setError] = useState('');
  const [isFallbackInitiallyTriggered, setIsFallbackInitiallyTriggered] = useState(false);
  const [loginInitState, setLoginInitState] = useState(LoginInitState.SilentLoading);
  const [identifier, setIdentifier] = useState<string>('');
  const statefulLoader = useRef(
    new StatefulLoader(
      () => setLoginInitState(LoginInitState.Loading),
      () => {
        config.onLoaded?.('loading finished', isFallbackInitiallyTriggered);
        setLoginInitState(LoginInitState.Loaded);
      },
      () => {
        config?.onLoaded?.('loading finished', isFallbackInitiallyTriggered);
        setLoginInitState(LoginInitState.Loaded);
      },
    ),
  );

  const simulateError = (): boolean => {
    const urlParams = new URLSearchParams(window.location.search);
    const maybeError = urlParams.get('cboSimulate');
    if (!maybeError) {
      return false;
    }

    // parse string to AppendSituationCode
    const typed = LoginSituationCode[maybeError as keyof typeof LoginSituationCode];
    handleSituation(typed);

    return true;
  };

  useEffect(() => {
    const init = async (ac: AbortController) => {
      if (simulateError()) {
        return;
      }

      log.debug('running init');
      statefulLoader.current.start();

      const url = new URL(window.location.href);
      const invitationToken = url.searchParams.get('invitationToken');
      if (invitationToken) {
        getConnectService().setInvitation(invitationToken);
      }

      getConnectService().enrichClientState(config.clientState);

      const res = await getConnectService().loginInit(ac);
      if (res.err) {
        if (res.val.type === ConnectErrorType.Cancel || res.val.type === ConnectErrorType.Untyped) {
          return;
        }

        statefulLoader.current.finishWithError();
        return handleSituation(LoginSituationCode.CboApiNotAvailablePreAuthenticator, res.val);
      }

      // we load flags from backend first, then we override them with the ones that are specified in the component's config
      const flags = new Flags(res.val.flags);
      if (sharedConfig.flags) {
        flags.addFlags(sharedConfig.flags);
      }
      setFlags(flags);

      if (!res.val.loginAllowed || showFallback) {
        return handleSituation(LoginSituationCode.DeniedByPartialRollout);
      }

      const lastLogin = getConnectService().getLastLogin();
      if (lastLogin) {
        log.debug('starting relogin UI');
        return navigateToScreen(LoginScreenType.PasskeyReLogin);
      }

      if (flags.hasSupportForEventLow()) {
        getConnectService().enqueueLowEvent({ eventType: 'li-ready', timestamp: Date.now() });
      }

      if (flags.hasSupportForConditionalUI()) {
        log.debug('starting conditional UI');
        void startConditionalUI(res.val.conditionalUIChallenge, flags);
      }

      statefulLoader.current.finish();
    };

    const ac = new AbortController();
    void init(ac);

    return () => {
      ac.abort();
      getConnectService().dispose();
    };
  }, [getConnectService]);

  const startConditionalUI = async (challenge: string | null, resolvedFlags: Flags) => {
    if (!challenge) {
      return;
    }

    if (resolvedFlags.hasSupportForEventLow()) {
      getConnectService().enqueueLowEvent({ eventType: 'cui-ready', timestamp: Date.now() });
    }

    let cuiStarted = false;
    const res = await getConnectService().conditionalUILogin(
      ac => config.onConditionalLoginStart?.(ac),
      () => {
        setCuiBasedLoading(true);
        cuiStarted = true;
      },
      () => {
        return;
      },
      loadedMs,
    );

    if (res.err) {
      // if a user cancel during CUI, she can try again
      if (res.val.type === ConnectErrorType.Cancel || res.val.type === ConnectErrorType.Untyped) {
        return handleSituation(LoginSituationCode.ClientPasskeyConditionalOperationCancelled, res.val);
      }

      // cuiStarted === true indicates that user has passed the authenticator
      if (cuiStarted) {
        return handleSituation(LoginSituationCode.CboApiNotAvailablePostConditionalAuthenticator, res.val);
      }

      return handleSituation(LoginSituationCode.CboApiNotAvailablePreConditionalAuthenticator, res.val);
    }

    if (resolvedFlags.hasSupportForEventLow()) {
      getConnectService().enqueueLowEvent({ eventType: 'cui-finish', timestamp: Date.now() });
    }
    await getConnectService().flushLowEvents();

    if (res.val.fallbackOperationError) {
      const data: CboApiFallbackOperationError = {
        initFallback: res.val.fallbackOperationError.initFallback,
        identifierFallback: res.val.fallbackOperationError.identifier ?? '',
        message: res.val.fallbackOperationError.error?.message ?? null,
        code: res.val.fallbackOperationError.error?.code,
      };

      return handleSituation(LoginSituationCode.CboApiFallbackOperationError, undefined, data);
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
  };

  const handleSubmit = useCallback(async () => {
    if (identifier === '') {
      return setError('Enter your email address.');
    }

    setIdentifierBasedLoading(true);
    setCurrentIdentifier(identifier);
    if (enableEventLow) {
      getConnectService().enqueueLowEvent({ eventType: 'li-finish', timestamp: Date.now() });
    }
    await getConnectService().flushLowEvents();
    config.onLoginStart?.();

    const resStart = await getConnectService().loginStart(identifier, PasskeyLoginSource.TextField, loadedMs);
    if (resStart.err) {
      return handleSituation(LoginSituationCode.CboApiNotAvailablePreAuthenticator, resStart.val);
    }

    if (resStart.val.isCDA) {
      navigateToScreen(LoginScreenType.LoginHybridScreen, resStart.val);
      return;
    }

    if (resStart.val.assertionOptions.length === 0) {
      const data: CboApiFallbackOperationError = {
        initFallback: resStart.val.fallbackOperationError.initFallback,
        identifierFallback: resStart.val.fallbackOperationError.identifier ?? '',
        message: resStart.val.fallbackOperationError.error?.message ?? null,
        code: resStart.val.fallbackOperationError.error?.code,
      };

      return handleSituation(LoginSituationCode.CboApiFallbackOperationError, undefined, data);
    }

    const res = await withLowEventWindow(
      {
        connectService: getConnectService(),
        enabled: enableEventLow,
        startEventType: 'pl-start',
        finishEventType: 'pl-finish',
      },
      () => getConnectService().loginContinue(resStart.val),
    );
    if (res.err) {
      setIdentifierBasedLoading(false);
      if (res.val.type === ConnectErrorType.Cancel || res.val.type === ConnectErrorType.Untyped) {
        return handleSituation(
          LoginSituationCode.ClientPasskeyOperationCancelled,
          res.val,
          resStart.val.assertionOptions,
        );
      }

      return handleSituation(LoginSituationCode.CboApiNotAvailablePostAuthenticator, res.val);
    }

    try {
      await getConnectService().flushLowEvents();
      await config.onComplete(
        connectLoginFinishToComplete(res.val),
        getConnectService().encodeClientState(),
        connectLoginFinishToWebauthnId(res.val),
      );
    } catch {
      void getConnectService().recordEventLoginErrorUntyped();
      return handleSituation(LoginSituationCode.CtApiNotAvailablePostAuthenticator);
    }
  }, [getConnectService, config, loadedMs, identifier]);

  const automaticFallback = (identifier: string, message: string | null) => {
    navigateToScreen(LoginScreenType.Invisible);
    setIsFallbackInitiallyTriggered(true);
    fallback(identifier, message);
  };

  const explicitFallback = () => {
    navigateToScreen(LoginScreenType.Invisible);
    fallback(identifier, null);
  };

  const handleSituation = (situationCode: LoginSituationCode, error?: ConnectError, data?: unknown) => {
    const messageCode = `situation: ${situationCode} ${error?.track()}`;
    log.debug(messageCode);

    const message = getLoginErrorMessage(situationCode);

    switch (situationCode) {
      case LoginSituationCode.CboApiNotAvailablePreAuthenticator:
        automaticFallback(identifier, message);
        void getConnectService().recordEventLoginErrorUnexpected(messageCode);

        statefulLoader.current.finish();
        break;
      case LoginSituationCode.DeniedByPartialRollout:
        automaticFallback(identifier, message);

        statefulLoader.current.finish();
        break;
      case LoginSituationCode.CboApiNotAvailablePostConditionalAuthenticator:
      case LoginSituationCode.CboApiNotAvailablePreConditionalAuthenticator:
      case LoginSituationCode.CtApiNotAvailablePostAuthenticator:
      case LoginSituationCode.CboApiNotAvailablePostAuthenticator:
        automaticFallback(identifier, message);
        void getConnectService().recordEventLoginErrorUnexpected(messageCode);

        setIdentifierBasedLoading(false);
        break;
      case LoginSituationCode.ClientPasskeyOperationCancelled: {
        const assertionOptions = data as string;
        navigateToScreen(LoginScreenType.ErrorSoft, { previousAssertionOptions: assertionOptions });
        void getConnectService().recordEventLoginError(messageCode);
        config.onError?.(situationCode.toString());

        setIdentifierBasedLoading(false);
        break;
      }
      case LoginSituationCode.ExplicitFallbackByUser:
        explicitFallback();

        void getConnectService().recordEventLoginExplicitAbort();
        break;
      case LoginSituationCode.CboApiFallbackOperationError: {
        const typed = data as CboApiFallbackOperationError;

        if (config.onUnknownUser && typed.code && typed.code === 'user_not_found') {
          return config.onUnknownUser(typed.identifierFallback);
        }

        if (typed.initFallback) {
          return automaticFallback(typed.identifierFallback, typed.message);
        }

        setError(typed.message ?? '');
        setCuiBasedLoading(false);
        setIdentifierBasedLoading(false);
        break;
      }
    }
  };

  // Enable auto complete for username and webauthn if conditional UI is supported
  // This is needed to enable multiple login instances on the same page however only one should have the autocomplete
  // Else the conditionalUI won't work
  const autoComplete = useMemo(() => (flags?.hasSupportForConditionalUI() ? 'username webauthn' : ''), [flags]);
  const enableEventLow = useMemo(() => flags?.hasSupportForEventLow() ?? false, [flags]);

  switch (loginInitState) {
    case LoginInitState.SilentLoading:
      return <></>;
    case LoginInitState.Loading:
      return <LoginInitLoading />;
    case LoginInitState.Loaded:
      return (
        <LoginInitLoaded
          isLoading={cuiBasedLoading || identifierBasedLoading}
          error={error}
          autoComplete={autoComplete}
          enableEventLow={enableEventLow}
          handleSubmit={() => void handleSubmit()}
          handleIdentifierUpdate={(v: string) => setIdentifier(v)}
        />
      );
  }
};
export default LoginInitScreen;
