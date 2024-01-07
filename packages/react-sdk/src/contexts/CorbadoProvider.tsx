import type { CorbadoAppParams, SessionUser } from '@corbado/types';
import type { NonRecoverableError } from '@corbado/web-core';
import { CorbadoApp } from '@corbado/web-core';
import type { FC, PropsWithChildren } from 'react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { CorbadoContextProps } from './CorbadoContext';
import { CorbadoContext } from './CorbadoContext';

export type CorbadoProviderParams = PropsWithChildren<
  CorbadoAppParams & {
    corbadoAppInstance?: CorbadoApp;
    initialUser?: SessionUser;
    initialShortSession?: string;
    initialGlobalError?: NonRecoverableError;
  }
>;

export const CorbadoProvider: FC<CorbadoProviderParams> = ({
  children,
  corbadoAppInstance,
  initialGlobalError,
  initialShortSession,
  initialUser,
  ...corbadoParams
}) => {
  const [corbadoApp] = useState(() => corbadoAppInstance ?? new CorbadoApp(corbadoParams));
  const [shortSession, setShortSession] = useState(initialShortSession);
  const [user, setUser] = useState(initialUser);
  const [loading, setLoading] = useState<boolean>(true);
  const [globalError, setGlobalError] = useState(initialGlobalError);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) {
      return;
    }

    setLoading(true);
    corbadoApp.authService.shortSessionChanges.subscribe(value => {
      if (value !== undefined) {
        setShortSession(value);
      }
    });

    corbadoApp.authService.userChanges.subscribe(value => {
      if (value !== undefined) {
        setUser(value);
      }
    });

    corbadoApp.globalErrors.subscribe(value => {
      setGlobalError(value);
    });

    corbadoApp.init();

    initialized.current = true;

    setLoading(false);
  }, []);

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

  const getPasskeys = useCallback(() => {
    return corbadoApp.authService.passkeyList();
  }, [corbadoApp]);

  const deletePasskey = useCallback(
    (id: string) => {
      return corbadoApp.authService.passkeyDelete(id);
    },
    [corbadoApp],
  );

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

  const logout = useCallback(() => {
    corbadoApp.authService.logout();
    setShortSession(undefined);
    setUser(undefined);
  }, [corbadoApp]);

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

  const contextValue = useMemo<CorbadoContextProps>(() => {
    return {
      corbadoApp,
      shortSession,
      user,
      globalError,
      loading,
      signUpWithPasskey,
      loginWithPasskey,
      loginWithConditionalUI,
      initLoginWithEmailOTP,
      completeLoginWithEmailOTP,
      logout,
      initSignUpWithEmailOTP,
      completeSignUpWithEmailOTP,
      appendPasskey,
      getPasskeys,
      deletePasskey,
      getUserAuthMethods,
      getProjectConfig,
      userExists,
    };
  }, [
    corbadoApp,
    shortSession,
    user,
    globalError,
    loading,
    signUpWithPasskey,
    loginWithPasskey,
    loginWithConditionalUI,
    initLoginWithEmailOTP,
    completeLoginWithEmailOTP,
    logout,
    initSignUpWithEmailOTP,
    completeSignUpWithEmailOTP,
    appendPasskey,
    getPasskeys,
    deletePasskey,
    getUserAuthMethods,
    getProjectConfig,
    userExists,
  ]);

  return <CorbadoContext.Provider value={contextValue}>{children}</CorbadoContext.Provider>;
};
