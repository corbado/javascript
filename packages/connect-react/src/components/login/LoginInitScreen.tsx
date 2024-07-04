import { PasskeyChallengeCancelledError } from '@corbado/web-core';
import log from 'loglevel';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import useLoginProcess from '../../hooks/useLoginProcess';
import useShared from '../../hooks/useShared';
import { Flags } from '../../types/flags';
import { LoginScreenType } from '../../types/screenTypes';
import InputField from '../shared/InputField';
import { LinkButton } from '../shared/LinkButton';
import { PrimaryButton } from '../shared/PrimaryButton';

const LoginInitScreen = () => {
  const { config, navigateToScreen, setCurrentIdentifier, setFlags } = useLoginProcess();
  const { sharedConfig, getConnectService } = useShared();
  const [loading, setLoading] = useState(false);
  const emailFieldRef = useRef<HTMLInputElement>();

  useEffect(() => {
    const init = async (ac: AbortController) => {
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
        config.onLoaded('loaded successfully', true);
        return;
      }

      const lastLogin = getConnectService().getLastLogin();

      if (lastLogin) {
        navigateToScreen(LoginScreenType.Passkey);

        config.onLoaded('loaded successfully', false);
        return;
      } else if (flags.hasSupportForConditionalUI()) {
        log.debug('starting conditional UI');
        void startConditionalUI(res.val.conditionalUIChallenge);

        config.onLoaded('loaded successfully', false);
      }
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
    if (res.err && (res.val instanceof PasskeyChallengeCancelledError || res.val.ignore)) {
      return;
    }

    if (res.err) {
      log.debug('fallback: error during conditional UI');
      navigateToScreen(LoginScreenType.Invisible);
      config.onFallback('');

      return;
    }

    config.onComplete(res.val.session);
  };

  const handleSubmit = useCallback(async () => {
    setLoading(true);

    const identifier = emailFieldRef.current?.value ?? '';
    setCurrentIdentifier(identifier);

    const res = await getConnectService().login(identifier);
    if (res.err) {
      setLoading(false);
      if (res.val.ignore) {
        return;
      }

      if (res.val instanceof PasskeyChallengeCancelledError) {
        navigateToScreen(LoginScreenType.ErrorSoft);
        return;
      }

      log.debug('fallback: error during password login start');
      navigateToScreen(LoginScreenType.Invisible);
      config.onFallback(identifier);

      return;
    }

    setLoading(false);
    config.onComplete(res.val.session);
  }, [getConnectService, config]);

  return (
    <div>
      <InputField
        id='email'
        name='email'
        type='email'
        autoComplete='username webauthn'
        autoFocus={true}
        placeholder='Email address'
        ref={(el: HTMLInputElement | null) => el && (emailFieldRef.current = el)}
      />
      <PrimaryButton
        type='submit'
        isLoading={loading}
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
    </div>
  );
};

export default LoginInitScreen;
