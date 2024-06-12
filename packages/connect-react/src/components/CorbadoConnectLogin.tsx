import type { CorbadoConnectLoginConfig } from '@corbado/types';
import { ConnectService } from '@corbado/web-core';
import type { FC } from 'react';
import { useCallback } from 'react';
import { useEffect, useState } from 'react';
import React from 'react';

import withTheme from './hoc/withTheme';
import LoginAllowedScreen from './LoginAllowedScreen';
import { LoadingSpinner } from './shared/LoadingSpinner';

enum LoginState {
  Loading,
  LoginDisallowed,
  LoginAllowed,
}

const CorbadoConnectLogin: FC<CorbadoConnectLoginConfig> = ({
  projectId,
  fallbackUIContainerId,
  fallbackUITextFieldId,
  frontendApiUrlSuffix,
  onLoaded,
  onComplete,
  isDebug,
}) => {
  const [connectService] = useState(
    () => new ConnectService(projectId, frontendApiUrlSuffix ?? 'frontendapi.corbado.io', isDebug ?? false),
  );
  const [loginState, setLoginState] = useState<LoginState>(LoginState.Loading);
  const [conditionalUIChallenge, setConditionalUIChallenge] = useState<string | null>(null);

  // init login process
  useEffect(() => {
    const init = async (ac: AbortController) => {
      const res = await connectService.loginInit(ac);
      if (res.err) {
        console.error(res.val);
        return;
      }

      const elem = document.getElementById(fallbackUIContainerId);
      if (!elem) {
        // throw error
        return;
      }

      onLoaded('loaded successfully');
      if (!res.val.loginAllowed) {
        elem.style.display = 'block';
        setLoginState(LoginState.LoginDisallowed);
      } else {
        elem.style.display = 'none';
        setConditionalUIChallenge(res.val.conditionalUIChallenge);
        setLoginState(LoginState.LoginAllowed);
      }
    };

    const abortController = new AbortController();
    init(abortController).catch(e => {
      console.error(e);
    });

    return () => {
      abortController.abort();
    };
  }, []);

  // start conditionalUI

  const onFallback = useCallback((identifier: string) => {
    console.log('onFallback');
    const fallbackContainer = document.getElementById(fallbackUIContainerId);
    if (!fallbackContainer) {
      // throw error
      return;
    }

    fallbackContainer.style.display = 'block';

    const fallbackTextField = document.getElementById(fallbackUITextFieldId);
    if (!fallbackTextField) {
      console.log('fbt', fallbackTextField);
      // throw error
      return;
    }

    fallbackTextField.setAttribute('value', identifier);

    setLoginState(LoginState.LoginDisallowed);
  }, []);

  switch (loginState) {
    case LoginState.Loading:
      return <LoadingSpinner />;
    case LoginState.LoginDisallowed:
      return <div></div>;
    case LoginState.LoginAllowed:
      return (
        <LoginAllowedScreen
          connectService={connectService}
          conditionalUIChallenge={conditionalUIChallenge}
          onComplete={onComplete}
          onFallback={onFallback}
        />
      );
  }
};

export default withTheme(CorbadoConnectLogin);
