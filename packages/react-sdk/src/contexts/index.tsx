import type { CorbadoAppParams, SessionUser } from '@corbado/types';
import type { NonRecoverableError } from '@corbado/web-core';
import { CorbadoApp } from '@corbado/web-core';
import type { FC, PropsWithChildren } from 'react';
import React, { useEffect, useState } from 'react';

import { CorbadoSessionProvider } from './CorbadoSessionProvider';

export type CorbadoProviderParams = PropsWithChildren<CorbadoAppParams & { corbadoAppInstance?: CorbadoApp }>;

export const CorbadoProvider: FC<CorbadoProviderParams> = ({ children, corbadoAppInstance, ...corbadoParams }) => {
  const [corbadoApp] = useState(() => corbadoAppInstance ?? new CorbadoApp(corbadoParams));
  const [globalError, setGlobalError] = useState<NonRecoverableError | undefined>();
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<SessionUser | undefined>();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [shortSession, setShortSession] = useState<string | undefined>();

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

    const shortSessionSub = corbadoApp.sessionService.shortSessionChanges.subscribe((value: string | undefined) => {
      setShortSession(value);
    });

    return () => {
      userSub.unsubscribe();
      authStateSub.unsubscribe();
      shortSessionSub.unsubscribe();
    };
  }, []);

  return (
    <CorbadoSessionProvider
      loading={loading}
      user={user}
      isAuthenticated={isAuthenticated}
      shortSession={shortSession}
      corbadoApp={corbadoApp}
      globalError={globalError}
    >
      {children}
    </CorbadoSessionProvider>
  );
};
