import { PasskeyChallengeCancelledError, PasskeyLoginSource } from '@corbado/web-core';
import log from 'loglevel';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import useLoginProcess from '../../hooks/useLoginProcess';
import useShared from '../../hooks/useShared';
import { Flags } from '../../types/flags';
import { LoginScreenType } from '../../types/screenTypes';
import InputField from '../shared/InputField';
import { LinkButton } from '../shared/LinkButton';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { Notification } from '../shared/Notification';
import { PrimaryButton } from '../shared/PrimaryButton';
import useLoading from '../../hooks/useLoading';

const LoginInitScreen = () => {
  const { config, navigateToScreen, setCurrentIdentifier, setFlags } = useLoginProcess();
  const { sharedConfig, getConnectService } = useShared();
  const [loginPending, setLoginPending] = useState(false);
  const [error, setError] = useState('');
  const { loading, startLoading, finishLoading } = useLoading();
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

      if (!res.val.loginAllowed) {
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

    const res = await getConnectService().conditionalUILogin();
    if (res.err) {
      if (res.val.ignore || res.val instanceof PasskeyChallengeCancelledError) {
        return;
      }
      log.debug('fallback: error during conditional UI');

      config.onError?.('PasskeyLoginFailure');
      setError('Your attempt to log in with your Passkey was unsuccessful. Please try again.');
      return;
    }

    if (config.successTimeout) {
      navigateToScreen(LoginScreenType.Success);
      config.onSuccess?.();
      setTimeout(() => config.onComplete(res.val.session), config.successTimeout);

      return;
    }

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

    if (config.successTimeout) {
      navigateToScreen(LoginScreenType.Success);
      config.onSuccess?.();
      setTimeout(() => config.onComplete(res.val.session), config.successTimeout);

      return;
    }

    config.onComplete(res.val.session);
  }, [getConnectService, config]);

  useEffect(() => {
    if (!loading) {
      // config.onLoaded should trigger when the form renders else it will cause issues with input detection.
      config.onLoaded('loaded successfully', isFallbackInitiallyTriggered);
    }
  }, [loading, config, isFallbackInitiallyTriggered]);

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
            label={config.showLabel ? 'Email address' : undefined}
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
