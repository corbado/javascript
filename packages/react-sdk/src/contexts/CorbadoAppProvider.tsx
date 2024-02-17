import type { CorbadoApp, NonRecoverableError } from '@corbado/web-core';
import type { FC, PropsWithChildren } from 'react';
import React, { memo, useCallback } from 'react';

import { CorbadoAppContext } from './CorbadoAppContext';

type CorbadoAppProviderParams = PropsWithChildren<{
  corbadoApp: CorbadoApp;
  loading: boolean;
  isAuthenticated: boolean;
  globalError: NonRecoverableError | undefined;
  setGlobalError: (error: NonRecoverableError | undefined) => void;
}>;

export const CorbadoAppProvider: FC<CorbadoAppProviderParams> = memo(
  ({ children, corbadoApp, loading, globalError, isAuthenticated, setGlobalError }) => {
    /** Passkey Management APIs */
    const getPasskeys = useCallback(() => {
      return corbadoApp.authService.passkeyList();
    }, [corbadoApp]);

    const deletePasskey = useCallback(
      (id: string) => {
        return corbadoApp.authService.passkeyDelete(id);
      },
      [corbadoApp],
    );

    /** Other APIs */
    const getUserAuthMethods = useCallback(
      (email: string) => {
        return corbadoApp.authService.authMethods(email);
      },
      [corbadoApp],
    );

    const userExists = useCallback(
      (email: string) => {
        return corbadoApp.authService.userExists(email);
      },
      [corbadoApp],
    );

    const getProjectConfig = useCallback(() => {
      return corbadoApp.projectService.getProjectConfig();
    }, [corbadoApp]);

    const logout = useCallback(() => {
      corbadoApp.authService.logout();
      corbadoApp.clearGlobalErrors();
    }, [corbadoApp]);

    return (
      <CorbadoAppContext.Provider
        value={{
          corbadoApp,
          globalError,
          loading,
          isAuthenticated,
          getPasskeys,
          deletePasskey,
          getUserAuthMethods,
          getProjectConfig,
          userExists,
          logout,
          setGlobalError,
        }}
      >
        {children}
      </CorbadoAppContext.Provider>
    );
  },
);
