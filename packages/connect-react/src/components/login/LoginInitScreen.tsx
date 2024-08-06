import { ConnectUserNotFound, PasskeyChallengeCancelledError, PasskeyLoginSource } from '@corbado/web-core';
import log from 'loglevel';
import type { FC } from 'react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

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
}

const LoginInitScreen: FC<Props> = ({ showFallback = false }) => {
  const { config, navigateToScreen, setCurrentIdentifier, setFlags } = useLoginProcess();
  const { sharedConfig, getConnectService } = useShared();
  const [loginPending, setLoginPending] = useState(false);
  const [error, setError] = useState('');
  const { loading, startLoading, finishLoading, isInitialLoadingStarted } = useLoading();
  const [isFallbackInitiallyTriggered, setIsFallbackInitiallyTriggered] = useState(false);
  const emailFieldRef = useRef<HTMLInputElement>();

  useEffect(() => {
    const init = async (ac: AbortController) => {
      startLoading();
      log.debug('running init');

      const res = await getConnectService().loginInit(ac);

      if (res.err) {
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

        config.onFallback('');
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
      ac => onCUIStarted(),
      () => setLoginPending(true),
      () => setLoginPending(false),
    );

    if (res.err) {
      if (res.val.ignore || res.val instanceof PasskeyChallengeCancelledError) {
        setLoginPending(false);
        return;
      }
      log.debug('fallback: error during conditional UI');

      config.onError?.('PasskeyLoginFailure');
      setError('Your attempt to log in with your Passkey was unsuccessful. Please try again.');
      setLoginPending(false);

      return;
    }

    setLoginPending(false);
    config.onComplete(res.val.session);
  };

  const handleSubmit = useCallback(async () => {
    setLoginPending(true);

    const identifier = emailFieldRef.current?.value ?? '';

    setCurrentIdentifier(identifier);

    const res = await getConnectService().login(identifier, PasskeyLoginSource.TextField);
    if (res.err) {
      setLoginPending(false);
      if (res.val.ignore) {
        return;
      }

      if (res.val instanceof ConnectUserNotFound) {
        setError('There is no account registered with this email.');
        return;
      }

      if (res.val instanceof PasskeyChallengeCancelledError) {
        config.onError?.('PasskeyChallengeAborted');
        navigateToScreen(LoginScreenType.ErrorSoft);
        return;
      }

      log.debug('fallback: error during password login start');
      config.onError?.('PasskeyLoginFailure');
      setError('Your attempt to log in with your Passkey was unsuccessful. Please try again.');
      navigateToScreen(LoginScreenType.Invisible);
      config.onFallback(identifier);

      return;
    }

    setLoginPending(false);

    config.onComplete(res.val.session);
  }, [getConnectService, config]);

  useEffect(() => {
    if (!loading && isInitialLoadingStarted) {
      // config.onLoaded should trigger when the form renders else it will cause issues with input detection.
      config.onLoaded('loaded successfully', isFallbackInitiallyTriggered);
    }
  }, [loading, isFallbackInitiallyTriggered, isInitialLoadingStarted]);

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
            autoComplete='username webauthn'
            autoFocus={true}
            placeholder=''
            ref={(el: HTMLInputElement | null) => el && (emailFieldRef.current = el)}
          />
          <PrimaryButton
            type='submit'
            isLoading={loginPending}
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
