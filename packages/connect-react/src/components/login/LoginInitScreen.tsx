import {
  ConnectConditionalUIPasskeyDeleted,
  ConnectCustomError,
  ConnectExistingPasskeysNotAvailable,
  ConnectUserNotFound,
  PasskeyChallengeCancelledError,
  PasskeyLoginSource,
} from '@corbado/web-core';
import type { ConnectLoginFinishRsp } from '@corbado/web-core/dist/api/v2';
import log from 'loglevel';
import type { FC } from 'react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import useLoginProcess from '../../hooks/useLoginProcess';
import useShared from '../../hooks/useShared';
import { Flags } from '../../types/flags';
import { LoginScreenType } from '../../types/screenTypes';
import type { PreAuthenticatorCustomErrorData } from '../../types/situations';
import { getLoginErrorMessage, LoginSituationCode } from '../../types/situations';
import { StatefulLoader } from '../../utils/statefulLoader';
import LoginInitLoaded from './base/LoginInitLoaded';
import LoginInitLoading from './base/LoginInitLoading';

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

const LoginInitScreen: FC<Props> = ({ showFallback = false }) => {
  const { config, navigateToScreen, setCurrentIdentifier, setFlags, flags, loadedMs, fallback, fallbackCustom } =
    useLoginProcess();
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
        config.onLoaded('loading finished', isFallbackInitiallyTriggered);
        setLoginInitState(LoginInitState.Loaded);
      },
      () => {
        config.onLoaded('loading finished', isFallbackInitiallyTriggered);
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

      const res = await getConnectService().loginInit(ac);
      if (res.err) {
        if (res.val.ignore) {
          return;
        }

        statefulLoader.current.finishWithError();
        return handleSituation(LoginSituationCode.CboApiNotAvailablePreAuthenticator);
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
      } else if (flags.hasSupportForConditionalUI()) {
        log.debug('starting conditional UI');
        void startConditionalUI(res.val.conditionalUIChallenge);
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

  const startConditionalUI = async (challenge: string | null) => {
    if (!challenge) {
      return;
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
    );

    if (res.err) {
      // if a user cancel during CUI, she can try again
      if (res.val.ignore || res.val instanceof PasskeyChallengeCancelledError) {
        return handleSituation(LoginSituationCode.ClientPasskeyConditionalOperationCancelled);
      }

      // if a passkey has been deleted, CUI will fail => fallback with message
      if (res.val instanceof ConnectConditionalUIPasskeyDeleted) {
        return handleSituation(LoginSituationCode.PasskeyNotAvailablePostConditionalAuthenticator);
      }

      // cuiStarted === true indicates that user has passed the authenticator
      if (cuiStarted) {
        return handleSituation(LoginSituationCode.CboApiNotAvailablePostConditionalAuthenticator);
      }

      return handleSituation(LoginSituationCode.CboApiNotAvailablePreConditionalAuthenticator);
    }

    try {
      await config.onComplete(connectLoginFinishToComplete(res.val));
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
    config.onLoginStart?.();

    const resStart = await getConnectService().loginStart(identifier, PasskeyLoginSource.TextField, loadedMs);
    if (resStart.err) {
      if (resStart.val instanceof ConnectUserNotFound) {
        return handleSituation(LoginSituationCode.PreAuthenticatorUserNotFound);
      }
      if (resStart.val instanceof ConnectCustomError) {
        return handleSituation(LoginSituationCode.PreAuthenticatorCustomError, resStart.val);
      }
      if (resStart.val instanceof ConnectExistingPasskeysNotAvailable) {
        return handleSituation(LoginSituationCode.PreAuthenticatorExistingPasskeysNotAvailable);
      }

      return handleSituation(LoginSituationCode.CboApiNotAvailablePreAuthenticator);
    }

    if (resStart.val.isCDA) {
      navigateToScreen(LoginScreenType.LoginHybridScreen, resStart.val);
      return;
    }

    const res = await getConnectService().loginContinue(resStart.val);
    if (res.err) {
      setIdentifierBasedLoading(false);
      if (res.val instanceof PasskeyChallengeCancelledError) {
        return handleSituation(LoginSituationCode.ClientPasskeyOperationCancelled);
      }

      return handleSituation(LoginSituationCode.CboApiNotAvailablePostAuthenticator);
    }

    try {
      await config.onComplete(connectLoginFinishToComplete(res.val));
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

  const handleSituation = (situationCode: LoginSituationCode, data?: unknown) => {
    const messageCode = `situation: ${situationCode}`;
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
      case LoginSituationCode.PasskeyNotAvailablePostConditionalAuthenticator:
      case LoginSituationCode.CboApiNotAvailablePostConditionalAuthenticator:
      case LoginSituationCode.CboApiNotAvailablePreConditionalAuthenticator:
      case LoginSituationCode.CtApiNotAvailablePostAuthenticator:
      case LoginSituationCode.CboApiNotAvailablePostAuthenticator:
      case LoginSituationCode.PreAuthenticatorExistingPasskeysNotAvailable:
        automaticFallback(identifier, message);
        void getConnectService().recordEventLoginErrorUnexpected(messageCode);

        setIdentifierBasedLoading(false);
        break;
      case LoginSituationCode.ClientPasskeyOperationCancelled:
        navigateToScreen(LoginScreenType.ErrorSoft);
        void getConnectService().recordEventLoginError(messageCode);
        config.onError?.(situationCode.toString());

        setIdentifierBasedLoading(false);
        break;
      case LoginSituationCode.PreAuthenticatorUserNotFound:
        setError(message ?? '');
        void getConnectService().recordEventLoginErrorUnexpected(messageCode);

        setIdentifierBasedLoading(false);
        break;
      case LoginSituationCode.ExplicitFallbackByUser:
        explicitFallback();

        void getConnectService().recordEventLoginExplicitAbort();
        break;
      case LoginSituationCode.PreAuthenticatorCustomError: {
        navigateToScreen(LoginScreenType.Invisible);
        void getConnectService().recordEventLoginErrorUnexpected(messageCode);
        if (!data) {
          return fallback(identifier, null);
        }

        const typed = data as PreAuthenticatorCustomErrorData;
        fallbackCustom(identifier, typed.code, typed.message);
      }
    }
  };

  // Enable auto complete for username and webauthn if conditional UI is supported
  // This is needed to enable multiple login instances on the same page however only one should have the autocomplete
  // Else the conditionalUI won't work
  const autoComplete = useMemo(() => (flags?.hasSupportForConditionalUI() ? 'username webauthn' : ''), [flags]);

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
          handleSubmit={() => void handleSubmit()}
          handleIdentifierUpdate={(v: string) => setIdentifier(v)}
        />
      );
  }
};
export default LoginInitScreen;
