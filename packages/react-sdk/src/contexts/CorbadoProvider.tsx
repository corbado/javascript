import type { CorbadoAppParams, SessionUser } from '@corbado/types';
import type { NonRecoverableError } from '@corbado/web-core';
import { CorbadoApp } from '@corbado/web-core';
import type { FC, PropsWithChildren } from 'react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { CorbadoContextProps } from './CorbadoContext';
import { CorbadoContext } from './CorbadoContext';

export type CorbadoProviderParams = PropsWithChildren<CorbadoAppParams & { corbadoAppInstance?: CorbadoApp }>;

export const CorbadoProvider: FC<CorbadoProviderParams> = ({ children, corbadoAppInstance, ...corbadoParams }) => {
  const [corbadoApp] = useState(() => corbadoAppInstance ?? new CorbadoApp(corbadoParams));
  const [shortSession, setShortSession] = useState<string | undefined>();
  const [user, setUser] = useState<SessionUser | undefined>();
  const [loading, setLoading] = useState<boolean>(true);
  const [globalError, setGlobalError] = useState<NonRecoverableError | undefined>();
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) {
      return;
    }

    setLoading(true);
    corbadoApp.init();
    corbadoApp.authService.shortSessionChanges.subscribe((value: string | undefined) => {
      if (value !== undefined) {
        setShortSession(value);
      }
    });

    corbadoApp.authService.userChanges.subscribe((value: SessionUser | undefined) => {
      if (value !== undefined) {
        setUser(value);
      }
    });

    corbadoApp.globalErrors.subscribe((value: NonRecoverableError | undefined) => {
      setGlobalError(value);
    });

    initialized.current = true;

    setLoading(false);
  }, []);

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
    setShortSession(undefined);
    setUser(undefined);
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
    };
  }, [
    corbadoApp,
    shortSession,
    user,
    globalError,
    loading,
    logout,
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
  ]);

  return <CorbadoContext.Provider value={contextValue}>{children}</CorbadoContext.Provider>;
};
