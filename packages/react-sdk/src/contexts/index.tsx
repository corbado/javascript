import type { CorbadoAppParams, SessionUser } from '@corbado/types';
import type { NonRecoverableError } from '@corbado/web-core';
import { CorbadoApp } from '@corbado/web-core';
import type { FC, PropsWithChildren } from 'react';
import React, { useEffect, useRef, useState } from 'react';

import { CorbadoAppProvider } from './CorbadoAppProvider';
import { CorbadoSessionProvider } from './CorbadoSessionProvider';

export type CorbadoProviderParams = PropsWithChildren<CorbadoAppParams & { corbadoAppInstance?: CorbadoApp }>;

export const CorbadoProvider: FC<CorbadoProviderParams> = ({ children, corbadoAppInstance, ...corbadoParams }) => {
  const [corbadoApp] = useState(() => corbadoAppInstance ?? new CorbadoApp(corbadoParams));
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<SessionUser | undefined>();
  const [globalError, setGlobalError] = useState<NonRecoverableError | undefined>();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [shortSession, setShortSession] = useState<string | undefined>();
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) {
      return;
    }

    setLoading(true);
    void corbadoApp.init().then(() => {
      initialized.current = true;
      setLoading(false);
    });

    corbadoApp.authService.userChanges.subscribe(value => {
      setUser(value);
    });

    corbadoApp.globalErrors.subscribe(value => {
      setGlobalError(value);
    });

    corbadoApp.authService.authStateChanges.subscribe(value => {
      setIsAuthenticated(!!value);
    });

    corbadoApp.authService.shortSessionChanges.subscribe((value: string | undefined) => {
      setShortSession(value);
    });
  }, []);

  return (
    <CorbadoSessionProvider
      loading={loading}
      user={user}
      isAuthenticated={isAuthenticated}
      shortSession={shortSession}
    >
      <CorbadoAppProvider
        corbadoApp={corbadoApp}
        loading={loading}
        isAuthenticated={isAuthenticated}
        globalError={globalError}
      >
        {children}
      </CorbadoAppProvider>
    </CorbadoSessionProvider>
  );
};
