import type { CorbadoApp, NonRecoverableError } from '@corbado/web-core';
import type { FC, PropsWithChildren } from 'react';
import React, { memo, useCallback } from 'react';

import { CorbadoAppContext } from './CorbadoAppContext';

type CorbadoAppProviderParams = PropsWithChildren<{
  corbadoApp: CorbadoApp;
  loading: boolean;
  isAuthenticated: boolean;
  globalError: NonRecoverableError | undefined;
}>;

export const CorbadoAppProvider: FC<CorbadoAppProviderParams> = memo(
  ({ children, corbadoApp, loading, globalError, isAuthenticated }) => {
    /** Passkey Authentication APIs */
    const signUpWithPasskey = useCallback(
      (email: string, username: string) => {
        return corbadoApp.authService.signUpWithPasskey(email, username);
      },
      [corbadoApp],
    );

    const loginWithPasskey = useCallback(
      (email: string) => {
        return corbadoApp.authService.loginWithPasskey(email);
      },
      [corbadoApp],
    );

    const loginWithConditionalUI = useCallback(() => {
      return corbadoApp.authService.loginWithConditionalUI();
    }, [corbadoApp]);

    const appendPasskey = useCallback(() => {
      return corbadoApp.authService.appendPasskey();
    }, [corbadoApp]);

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

    /** Email Link APIs */
    const initLoginWithEmailLink = useCallback(
      (email: string) => {
        return corbadoApp.authService.initLoginWithEmailLink(email);
      },
      [corbadoApp],
    );

    const completeLoginWithEmailLink = useCallback(() => {
      return corbadoApp.authService.completeLoginWithEmailLink();
    }, [corbadoApp]);

    const initSignUpWithEmailLink = useCallback(
      (email: string, username: string) => {
        return corbadoApp.authService.initSignUpWithEmailLink(email, username);
      },
      [corbadoApp],
    );

    const completeSignUpWithEmailLink = useCallback(() => {
      return corbadoApp.authService.completeSignupWithEmailLink();
    }, [corbadoApp]);

    /** Email OTP APIs */
    const initLoginWithEmailOTP = useCallback(
      (email: string) => {
        return corbadoApp.authService.initLoginWithEmailOTP(email);
      },
      [corbadoApp],
    );

    const completeLoginWithEmailOTP = useCallback(
      (code: string) => {
        return corbadoApp.authService.completeLoginWithEmailOTP(code);
      },
      [corbadoApp],
    );

    const initSignUpWithEmailOTP = useCallback(
      (email: string, username: string) => {
        return corbadoApp.authService.initSignUpWithEmailOTP(email, username);
      },
      [corbadoApp],
    );

    const completeSignUpWithEmailOTP = useCallback(
      (code: string) => {
        return corbadoApp.authService.completeSignupWithEmailOTP(code);
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
          signUpWithPasskey,
          loginWithPasskey,
          loginWithConditionalUI,
          initLoginWithEmailOTP,
          completeLoginWithEmailOTP,
          initSignUpWithEmailOTP,
          completeSignUpWithEmailOTP,
          initLoginWithEmailLink,
          completeLoginWithEmailLink,
          initSignUpWithEmailLink,
          completeSignUpWithEmailLink,
          appendPasskey,
          getPasskeys,
          deletePasskey,
          getUserAuthMethods,
          getProjectConfig,
          userExists,
          logout,
        }}
      >
        {children}
      </CorbadoAppContext.Provider>
    );
  },
);
