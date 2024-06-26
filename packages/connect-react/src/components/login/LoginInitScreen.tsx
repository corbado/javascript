import { PasskeyChallengeCancelledError } from '@corbado/web-core';
import log from 'loglevel';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import useLoginProcess from '../../hooks/useLoginProcess';
import { LoginScreenType } from '../../types/ScreenType';
import InputField from '../shared/InputField';
import { LinkButton } from '../shared/LinkButton';
import { PrimaryButton } from '../shared/PrimaryButton';

const LoginInitScreen = () => {
  const { config, getConnectService, navigateToScreen, setCurrentIdentifier } = useLoginProcess();
  const [loading, setLoading] = useState(false);
  // const [rememberEmail, setRememberEmail] = useState(false);
  const emailFieldRef = useRef<HTMLInputElement>();

  useEffect(() => {
    const init = async (ac: AbortController) => {
      console.log('running init');
      const res = await getConnectService().loginInit(ac);
      if (res.err) {
        console.error(res.val);
        return;
      }

      console.log(res.val.loginAllowed, res.val.conditionalUIChallenge);
      if (!res.val.loginAllowed) {
        navigateToScreen(LoginScreenType.Invisible);
        config.onFallback('');
      } else {
        console.log('starting conditional ui 1');
        void startConditionalUI(res.val.conditionalUIChallenge);
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

      log.debug('login not allowed');
      navigateToScreen(LoginScreenType.Invisible);
      config.onFallback(identifier);

      return;
    }

    setLoading(false);
    config.onComplete(res.val.session);
  }, [getConnectService, config]);

  /*
  <div>
    <Checkbox
      id='remember-me'
      label='Remember my email address'
      checked={rememberEmail}
      onChange={() => setRememberEmail(!rememberEmail)}
    />
  </div>
  */

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
          onClick={() => config.onSignupClick!()}
          className='cb-login-init-signup'
        >
          Signup for an account
        </LinkButton>
      )}
    </div>
  );
};

export default LoginInitScreen;
