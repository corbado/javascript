import type { SessionUser } from '@corbado/types';
import type { NonRecoverableError } from '@corbado/web-core';
import { CorbadoApp } from '@corbado/web-core';
import type { FC } from 'react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { AppProviderParams, CorbadoContextProps } from './CorbadoContext';
import { CorbadoContext } from './CorbadoContext';

export const CorbadoProvider: FC<AppProviderParams> = ({ children, ...corbadoParams }) => {
  const [corbadoApp] = useState(() => new CorbadoApp(corbadoParams));
  const [shortSession, setShortSession] = useState<string | undefined>();
  const [user, setUser] = useState<SessionUser | undefined>();
  const [loading, setLoading] = useState<boolean>(true);
  const [globalError, setGlobalError] = useState<NonRecoverableError | undefined>();
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) {
      return;
    }

    initialized.current = true;

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

  const getProjectConfig = useCallback(() => {
    return corbadoApp.projectService.getProjectConfig();
  }, [corbadoApp]);

  const contextValue = useMemo<CorbadoContextProps>(() => {
    return {
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
    };
  }, [
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
  ]);

  return <CorbadoContext.Provider value={contextValue}>{children}</CorbadoContext.Provider>;
};
