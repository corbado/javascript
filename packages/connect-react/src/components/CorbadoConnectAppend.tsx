import type { CorbadoConnectAppendConfig } from '@corbado/types';
import { ConnectService } from '@corbado/web-core';
import type { FC } from 'react';
import React, { useEffect, useState } from 'react';

import AppendAllowedScreen from './AppendAllowedScreen';
import withTheme from './hoc/withTheme';
import { LoadingSpinner } from './shared/LoadingSpinner';

enum AppendState {
  Loading,
  AppendDisallowed,
  AppendAllowed,
}

const CorbadoConnectAppend: FC<CorbadoConnectAppendConfig> = ({
  projectId,
  onLoaded,
  onSkip,
  onComplete,
  appendTokenProvider,
  frontendApiUrlSuffix,
  isDebug,
}) => {
  const [connectService] = useState(
    () => new ConnectService(projectId, frontendApiUrlSuffix ?? 'frontendapi.corbado.io', isDebug ?? false),
  );
  const [loginState, setLoginState] = useState<AppendState>(AppendState.Loading);
  const [appendToken, setAppendToken] = useState<string>('');

  // init login process
  useEffect(() => {
    const init = async (ac: AbortController) => {
      const res = await connectService.appendInit(ac);
      if (res.err) {
        console.error(res.val);
        return;
      }

      onLoaded('loaded successfully');
      if (!res.val.appendAllowed) {
        setLoginState(AppendState.AppendDisallowed);
        onSkip();

        return;
      }

      const appendToken = await appendTokenProvider();
      setAppendToken(appendToken);
      setLoginState(AppendState.AppendAllowed);
    };

    const abortController = new AbortController();
    init(abortController).catch(e => {
      console.error(`init error: ${e}`);
    });

    return () => {
      abortController.abort();
    };
  }, []);

  switch (loginState) {
    case AppendState.Loading:
      return <LoadingSpinner />;
    case AppendState.AppendDisallowed:
      return <div></div>;
    case AppendState.AppendAllowed:
      return (
        <AppendAllowedScreen
          connectService={connectService}
          appendToken={appendToken}
          onComplete={onComplete}
          onSkip={onSkip}
        />
      );
  }
};

export default withTheme(CorbadoConnectAppend);
