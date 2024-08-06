import type { CorbadoAppParams, LoginIdentifierType, SessionUser } from '@corbado/types';
import type { NonRecoverableError } from '@corbado/web-core';
import { CorbadoApp } from '@corbado/web-core';
import type { FC, PropsWithChildren } from 'react';
import { useCallback, useEffect, useState } from 'react';
import React from 'react';

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

  const getPasskeys = useCallback(
    (abortController?: AbortController) => {
      return corbadoApp.sessionService.passkeyList(abortController ?? new AbortController());
    },
    [corbadoApp],
  );

  const appendPasskey = useCallback(() => {
    return corbadoApp.sessionService.appendPasskey();
  }, [corbadoApp]);

  const logout = useCallback(() => {
    return corbadoApp.sessionService.logout();
  }, [corbadoApp]);

  const deletePasskey = useCallback(
    (id: string) => {
      return corbadoApp.sessionService.passkeyDelete(id);
    },
    [corbadoApp],
  );

  const getFullUser = useCallback(
    (abortController?: AbortController) => {
      return corbadoApp?.sessionService.getFullUser(abortController ?? new AbortController());
    },
    [corbadoApp],
  );

  const getIdentifierListConfig = useCallback(
    (abortController?: AbortController) => {
      return corbadoApp?.sessionService.getIdentifierListConfig(abortController ?? new AbortController());
    },
    [corbadoApp],
  );

  const updateName = useCallback(
    (fullName: string) => {
      return corbadoApp.sessionService.updateName(fullName);
    },
    [corbadoApp],
  );

  const updateUsername = useCallback(
    (identifierID: string, username: string) => {
      return corbadoApp.sessionService.updateUsername(identifierID, username);
    },
    [corbadoApp],
  );

  const createIdentifier = useCallback(
    (identifierType: LoginIdentifierType, value: string) => {
      return corbadoApp.sessionService.createIdentifier(identifierType, value);
    },
    [corbadoApp],
  );

  const deleteIdentifier = useCallback(
    (identifierID: string) => {
      return corbadoApp.sessionService.deleteIdentifier(identifierID);
    },
    [corbadoApp],
  );

  const verifyIdentifierStart = useCallback(
    (identifierID: string) => {
      return corbadoApp.sessionService.verifyIdentifierStart(identifierID);
    },
    [corbadoApp],
  );

  const verifyIdentifierFinish = useCallback(
    (identifierID: string, code: string) => {
      return corbadoApp.sessionService.verifyIdentifierFinish(identifierID, code);
    },
    [corbadoApp],
  );

  const deleteUser = useCallback(() => {
    return corbadoApp.sessionService.deleteUser();
  }, [corbadoApp]);

  return (
    <CorbadoSessionContext.Provider
      value={{
        corbadoApp,
        shortSession,
        loading,
        user,
        isAuthenticated,
        appendPasskey,
        getFullUser,
        getIdentifierListConfig,
        updateName,
        updateUsername,
        createIdentifier,
        deleteIdentifier,
        verifyIdentifierStart,
        verifyIdentifierFinish,
        deleteUser,
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
