import {
  ConnectRequestTimedOut,
  ConnectUserNotFound,
  PasskeyChallengeCancelledError,
  PasskeyLoginSource,
} from '@corbado/web-core';
import log from 'loglevel';
import type { FC } from 'react';
import { useEffect } from 'react';
import React, { useCallback, useMemo, useRef, useState } from 'react';

import useLoading from '../../hooks/useLoading';
import useLoginProcess from '../../hooks/useLoginProcess';
import useShared from '../../hooks/useShared';
import { Flags } from '../../types/flags';
import { LoginScreenType } from '../../types/screenTypes';
import InputField from '../shared/InputField';
import { LinkButton } from '../shared/LinkButton';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { Notification } from '../shared/Notification';
import { PrimaryButton } from '../shared/PrimaryButton';

interface Props {
  showFallback?: boolean;
  prefilledIdentifier?: string;
}

const LoginInitScreen: FC<Props> = ({ showFallback = false, prefilledIdentifier }) => {
  const { config, navigateToScreen, setCurrentIdentifier, setFlags, flags } = useLoginProcess();
  const { sharedConfig, getConnectService } = useShared();
  const [cuiBasedLoading, setCuiBasedLoading] = useState(false);
  const [identifierBasedLoading, setIdentifierBasedLoading] = useState(false);
  const [error, setError] = useState('');
  const { loading, startLoading, finishLoading, isInitialLoadingStarted } = useLoading();
  const [isFallbackInitiallyTriggered, setIsFallbackInitiallyTriggered] = useState(false);
  const emailFieldRef = useRef<HTMLInputElement>();

  const handleFallback = useCallback(
    (identifier: string) => {
      navigateToScreen(LoginScreenType.Invisible);
      config.onFallback(identifier);
    },
    [navigateToScreen, config],
  );

  useEffect(() => {
    const init = async (ac: AbortController) => {
      startLoading();
      log.debug('running init');

      const res = await getConnectService().loginInit(ac);
      if (res.err) {
        if (res.val.ignore) {
          return;
        }

        log.error(res.val);
        return;
      }

      // we load flags from backend first, then we override them with the ones that are specified in the component's config
      const flags = new Flags(res.val.flags);

      if (sharedConfig.flags) {
        flags.addFlags(sharedConfig.flags);
      }

      setFlags(flags);

      if (!res.val.loginAllowed || showFallback) {
        log.debug('fallback: login not allowed');
        navigateToScreen(LoginScreenType.Invisible);

        config.onFallback(prefilledIdentifier ?? '');
        setIsFallbackInitiallyTriggered(true);

        finishLoading();
        return;
      }

      const lastLogin = getConnectService().getLastLogin();
      if (lastLogin) {
        log.debug('starting relogin UI');
        return navigateToScreen(LoginScreenType.PasskeyReLogin);
      } else if (flags.hasSupportForConditionalUI()) {
        log.debug('starting conditional UI');
        void startConditionalUI(res.val.conditionalUIChallenge);
      }

      finishLoading();
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
      if (res.val instanceof ConnectRequestTimedOut) {
        handleFallback(prefilledIdentifier ?? '');
        return;
      }

      if (res.val.ignore || res.val instanceof PasskeyChallengeCancelledError) {
        setCuiBasedLoading(false);
        return;
      }

      log.debug('fallback: error during conditional UI');

      config.onError?.('PasskeyLoginFailure');
      setError('Your attempt to log in with your Passkey was unsuccessful. Please try again.');
      setCuiBasedLoading(false);

      return;
    }

    config.onComplete(res.val.session);
  };

  const handleSubmit = useCallback(async () => {
    setIdentifierBasedLoading(true);

    const identifier = emailFieldRef.current?.value ?? '';

    setCurrentIdentifier(identifier);

    config.onLoginStart?.();

    const resStart = await getConnectService().loginStart(identifier, PasskeyLoginSource.TextField);

    if (resStart.err) {
      setIdentifierBasedLoading(false);

      if (resStart.val instanceof ConnectRequestTimedOut) {
        handleFallback(identifier);
        return;
      }

      if (resStart.val.ignore) {
        return;
      }

      if (resStart.val instanceof ConnectUserNotFound) {
        setError('There is no account registered with this email.');
        return;
      }

      log.debug('fallback: error during password login start');
      config.onError?.('PasskeyLoginFailure');
      void getConnectService().recordEventLoginError();
      handleFallback(identifier);

      return;
    }

    if (resStart.val.isCDA) {
      navigateToScreen(LoginScreenType.LoginHybridScreen, resStart);
      return;
    }

    const res = await getConnectService().loginContinue(resStart);

    if (res.err) {
      setIdentifierBasedLoading(false);

      if (res.val instanceof ConnectRequestTimedOut) {
        handleFallback(identifier);
        return;
      }

      if (res.val.ignore) {
        return;
      }

      if (res.val instanceof PasskeyChallengeCancelledError) {
        config.onError?.('PasskeyChallengeAborted');
        navigateToScreen(LoginScreenType.ErrorSoft);
        void getConnectService().recordEventLoginError();
        return;
      }

      log.debug('fallback: error during password login start');
      config.onError?.('PasskeyLoginFailure');
      void getConnectService().recordEventLoginError();
      handleFallback(identifier);

      return;
    }

    config.onComplete(res.val.session);
  }, [getConnectService, config]);

  useEffect(() => {
    if (!loading && isInitialLoadingStarted) {
      // config.onLoaded should trigger when the form renders else it will cause issues with input detection.
      config.onLoaded('loaded successfully', isFallbackInitiallyTriggered);
    }
  }, [loading, isFallbackInitiallyTriggered, isInitialLoadingStarted]);

  // Enable auto complete for username and webauthn if conditional UI is supported
  // This is needed to enable multiple login instances on the same page however only one should have the autocomplete
  // Else the conditionalUI won't work
  const enableAutoComplete = useMemo(() => (flags?.hasSupportForConditionalUI() ? 'username webauthn' : ''), [flags]);

  if (!isInitialLoadingStarted) {
    return <></>;
  }

  return (
    <div>
      {loading ? (
        <div className='cb-login-loader-container'>
          <LoadingSpinner className='cb-login-loader' />
        </div>
      ) : (
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
            isLoading={cuiBasedLoading || identifierBasedLoading}
            onClick={() => void handleSubmit()}
          >
            Login
          </PrimaryButton>
        </>
      )}

      {config.onSignupClick && (
        <LinkButton
          onClick={() => config.onSignupClick?.()}
          className='cb-login-init-signup'
        >
          Signup for an account
        </LinkButton>
      )}
    </div>
  );
};

export default LoginInitScreen;
