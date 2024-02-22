import type { SessionUser } from '@corbado/types';
import type { CorbadoApp, NonRecoverableError } from '@corbado/web-core';
import type { FC, PropsWithChildren } from 'react';
import { useCallback } from 'react';
import React from 'react';

import { CorbadoSessionContext } from './CorbadoSessionContext';

type CorbadoSessionProviderParams = PropsWithChildren<{
  loading: boolean;
  shortSession: string | undefined;
  user: SessionUser | undefined;
  isAuthenticated: boolean;
  corbadoApp: CorbadoApp;
  globalError: NonRecoverableError | undefined;
}>;

export const CorbadoSessionProvider: FC<CorbadoSessionProviderParams> = ({
  children,
  loading,
  isAuthenticated,
  shortSession,
  user,
  corbadoApp,
  globalError,
}) => {
  const getPasskeys = useCallback(() => {
    return corbadoApp.sessionService.passkeyList();
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

  const setGlobalError = useCallback(
    (error: NonRecoverableError | undefined) => {
      corbadoApp.globalErrors.next(error);
    },
    [corbadoApp],
  );

  return (
    <CorbadoSessionContext.Provider
      value={{
        corbadoApp,
        shortSession,
        loading,
        user,
        isAuthenticated,
        getPasskeys,
        deletePasskey,
        logout,
        globalError,
        setGlobalError,
      }}
    >
      {children}
    </CorbadoSessionContext.Provider>
  );
};
