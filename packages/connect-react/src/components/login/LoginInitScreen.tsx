import {
  ConnectConditionalUIPasskeyDeleted,
  ConnectUserNotFound,
  PasskeyChallengeCancelledError,
  PasskeyLoginSource,
} from '@corbado/web-core';
import log from 'loglevel';
import type { FC } from 'react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import useLoginProcess from '../../hooks/useLoginProcess';
import useShared from '../../hooks/useShared';
import { Flags } from '../../types/flags';
import { LoginScreenType } from '../../types/screenTypes';
import { getLoginErrorMessage, LoginSituationCode } from '../../types/situations';
import { StatefulLoader } from '../../utils/statefulLoader';
import InputField from '../shared/InputField';
import { LinkButton } from '../shared/LinkButton';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { Notification } from '../shared/Notification';
import { PrimaryButton } from '../shared/PrimaryButton';

export enum LoginInitState {
  SilentLoading,
  Loading,
  Loaded,
}

interface Props {
  showFallback?: boolean;
  prefilledIdentifier?: string;
}

const LoginInitScreen: FC<Props> = ({ showFallback = false, prefilledIdentifier }) => {
  const { config, navigateToScreen, setCurrentIdentifier, setFlags, flags, loadedMs } = useLoginProcess();
  const { sharedConfig, getConnectService } = useShared();
  const [cuiBasedLoading, setCuiBasedLoading] = useState(false);
  const [identifierBasedLoading, setIdentifierBasedLoading] = useState(false);
  const [error, setError] = useState('');
  const [isFallbackInitiallyTriggered, setIsFallbackInitiallyTriggered] = useState(false);
  const [loginInitState, setLoginInitState] = useState(LoginInitState.SilentLoading);
  const emailFieldRef = useRef<HTMLInputElement>();
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

    const res = await getConnectService().conditionalUILogin(
      ac => config.onConditionalLoginStart?.(ac),
      () => setCuiBasedLoading(true),
      () => {
        return;
      },
    );

    if (res.err) {
      // if a user cancel during CUI, she can try again
      if (res.val.ignore || res.val instanceof PasskeyChallengeCancelledError) {
        return handleSituation(LoginSituationCode.ClientPasskeyConditionalOperationCancelled);
      }

      void getConnectService().recordEventLoginErrorUntyped();
      // if a passkey has been deleted, CUI will fail => fallback with message
      if (res.val instanceof ConnectConditionalUIPasskeyDeleted) {
        return handleSituation(LoginSituationCode.PasskeyNotAvailablePostConditionalAuthenticator);
      }

      // cuiBasedLoading === true indicates that user has passed the authenticator
      if (cuiBasedLoading) {
        return handleSituation(LoginSituationCode.CboApiNotAvailablePostConditionalAuthenticator);
      }

      return handleSituation(LoginSituationCode.CboApiNotAvailablePreConditionalAuthenticator);
    }

    try {
      await config.onComplete(res.val.session);
    } catch {
      return handleSituation(LoginSituationCode.CtApiNotAvailablePostAuthenticator);
    }
  };

  const handleSubmit = useCallback(async () => {
    const identifier = emailFieldRef.current?.value ?? '';
    if (identifier === '') {
      setError('Please enter your email address.');
      return;
    }

    setIdentifierBasedLoading(true);
    setCurrentIdentifier(identifier);
    config.onLoginStart?.();

    const resStart = await getConnectService().loginStart(identifier, PasskeyLoginSource.TextField, loadedMs);
    if (resStart.err) {
      if (resStart.val instanceof ConnectUserNotFound) {
        return handleSituation(LoginSituationCode.UserNotFound);
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
      await config.onComplete(res.val.session);
    } catch {
      void getConnectService().recordEventLoginErrorUntyped();
      return handleSituation(LoginSituationCode.CtApiNotAvailablePostAuthenticator);
    }
  }, [getConnectService, config, loadedMs]);

  const fallback = (identifier: string, message: string | null) => {
    navigateToScreen(LoginScreenType.Invisible);
    config.onFallback(identifier, message);
    setIsFallbackInitiallyTriggered(true);
    void getConnectService().recordEventLoginErrorUntyped();
  };

  const handleSituation = (situationCode: LoginSituationCode) => {
    log.debug(`situation: ${situationCode}`);

    const identifier = emailFieldRef.current?.value ?? '';
    const message = getLoginErrorMessage(situationCode);

    switch (situationCode) {
      case LoginSituationCode.CboApiNotAvailablePreAuthenticator:
        fallback(identifier, message);

        statefulLoader.current.finish();
        break;
      case LoginSituationCode.DeniedByPartialRollout:
        fallback(identifier, message);

        statefulLoader.current.finish();
        break;
      case LoginSituationCode.PasskeyNotAvailablePostConditionalAuthenticator:
      case LoginSituationCode.CboApiNotAvailablePostConditionalAuthenticator:
      case LoginSituationCode.CboApiNotAvailablePreConditionalAuthenticator:
      case LoginSituationCode.CtApiNotAvailablePostAuthenticator:
      case LoginSituationCode.CboApiNotAvailablePostAuthenticator:
        fallback(identifier, message);

        setIdentifierBasedLoading(false);
        break;
      case LoginSituationCode.ClientPasskeyOperationCancelled:
        navigateToScreen(LoginScreenType.ErrorSoft);
        void getConnectService().recordEventLoginError();
        config.onError?.(situationCode.toString());

        setIdentifierBasedLoading(false);
        break;
      case LoginSituationCode.UserNotFound:
        setError(message ?? '');

        setIdentifierBasedLoading(false);
        break;
      case LoginSituationCode.ExplicitFallbackByUser:
        navigateToScreen(LoginScreenType.Invisible);
        config.onFallback(identifier, message);

        void getConnectService().recordEventLoginExplicitAbort();
        break;
    }
  };

  // Enable auto complete for username and webauthn if conditional UI is supported
  // This is needed to enable multiple login instances on the same page however only one should have the autocomplete
  // Else the conditionalUI won't work
  const enableAutoComplete = useMemo(() => (flags?.hasSupportForConditionalUI() ? 'username webauthn' : ''), [flags]);

  switch (loginInitState) {
    case LoginInitState.SilentLoading:
      return <></>;
    case LoginInitState.Loading:
      return (
        <div className='cb-login-loader-container'>
          <LoadingSpinner className='cb-login-loader' />
        </div>
      );
    case LoginInitState.Loaded:
      return (
        <>
          {error ? (
            <Notification
              message={error}
              className='cb-error-notification'
            />
          ) : null}
          <InputField
            id='email'
            name='email'
            label='Email address'
            type='email'
            autoComplete={enableAutoComplete}
            autoFocus={true}
            placeholder=''
            ref={(el: HTMLInputElement | null) => {
              el && (emailFieldRef.current = el);
              if (prefilledIdentifier && el) {
                el.value = prefilledIdentifier;
              }
            }}
          />
          <PrimaryButton
            type='submit'
            className='cb-login-init-submit'
            isLoading={cuiBasedLoading || identifierBasedLoading}
            onClick={() => void handleSubmit()}
          >
            Login
          </PrimaryButton>

          {config.onSignupClick && (
            <LinkButton
              onClick={() => config.onSignupClick?.()}
              className='cb-login-init-signup'
            >
              Signup for an account
            </LinkButton>
          )}
        </>
      );
  }
};

export default LoginInitScreen;
