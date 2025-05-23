import type { CorbadoAppParams, SessionUser } from '@corbado/types';
import type { NonRecoverableError } from '@corbado/web-core';
import { CorbadoApp } from '@corbado/web-core';
import type { FC, PropsWithChildren } from 'react';
import { useCallback, useEffect, useState } from 'react';
import React from 'react';

import { useTelemetry } from '../hooks/useTelemetry';
import { CorbadoSessionContext } from './CorbadoSessionContext';

type CorbadoSessionProviderParams = PropsWithChildren<{
  corbadoAppInstance?: CorbadoApp;
  corbadoAppParams: CorbadoAppParams;
}>;

export const CorbadoSessionProvider: FC<CorbadoSessionProviderParams> = ({
  children,
  corbadoAppInstance,
  corbadoAppParams,
}) => {
  const [corbadoApp] = useState(() => corbadoAppInstance ?? new CorbadoApp(corbadoAppParams));
  const [globalError, setGlobalError] = useState<NonRecoverableError | undefined>();
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<SessionUser | undefined>();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [sessionToken, setSessionToken] = useState<string | undefined>();

  const telemetry = useTelemetry();

  const init = async () => {
    setLoading(true);
    const res = await corbadoApp.init();
    if (res.err) {
      setGlobalError(res.val);
      return;
    }

    setLoading(false);
  };

  useEffect(() => {
    void init();

    const userSub = corbadoApp.sessionService.userChanges.subscribe(value => {
      setUser(value);
    });

    const authStateSub = corbadoApp.sessionService.authStateChanges.subscribe(value => {
      setIsAuthenticated(!!value);
    });

    const sessionTokenSub = corbadoApp.sessionService.sessionTokenChanges.subscribe((value: string | undefined) => {
      setSessionToken(value);
    });

    return () => {
      userSub.unsubscribe();
      authStateSub.unsubscribe();
      sessionTokenSub.unsubscribe();
    };
  }, []);

  const getPasskeys = useCallback(
    (abortController?: AbortController) => {
      telemetry.logMethodCalled('getPasskeys');
      return corbadoApp.sessionService.passkeyList(abortController ?? new AbortController());
    },
    [corbadoApp, telemetry],
  );

  const appendPasskey = useCallback(() => {
    telemetry.logMethodCalled('appendPasskey');
    return corbadoApp.sessionService.appendPasskey();
  }, [corbadoApp, telemetry]);

  const logout = useCallback(() => {
    telemetry.logMethodCalled('logout');
    return corbadoApp.sessionService.logout();
  }, [corbadoApp, telemetry]);

  const deletePasskey = useCallback(
    (id: string) => {
      telemetry.logMethodCalled('deletePasskey');
      return corbadoApp.sessionService.passkeyDelete(id);
    },
    [corbadoApp, telemetry],
  );

  const getFullUser = useCallback(
    (abortController?: AbortController) => {
      telemetry.logMethodCalled('getFullUser');
      return corbadoApp?.sessionService.getFullUser(abortController ?? new AbortController());
    },
    [corbadoApp, telemetry],
  );

  return (
    <CorbadoSessionContext.Provider
      value={{
        corbadoApp,
        sessionToken,
        loading,
        user,
        isAuthenticated,
        appendPasskey,
        getFullUser,
        getPasskeys,
        deletePasskey,
        logout,
        globalError,
      }}
    >
      {children}
    </CorbadoSessionContext.Provider>
  );
};
