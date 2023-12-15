import { useCorbado } from '@corbado/react-sdk';
import type { FlowNames } from '@corbado/shared-ui';
import { LoginFlowNames, makeApiCallWithErrorHandler, SignUpFlowNames } from '@corbado/shared-ui';
import type { PropsWithChildren } from 'react';
import React, { useCallback, useMemo, useRef, useState } from 'react';

import type { UserDataContextProps } from './UserDataContext';
import { UserDataContext } from './UserDataContext';

export const UserDataProvider = ({ children }: PropsWithChildren) => {
  const { initLoginWithEmailOTP, initSignUpWithEmailOTP } = useCorbado();
  const [email, setEmail] = useState<string>();
  const [userName, setUserName] = useState<string>();
  const [emailError, setEmailError] = useState<string>();
  const emailSentTo = useRef<string>();

  const sendEmail = useCallback(
    async (currentFlow: FlowNames) => {
      if (!email || email === emailSentTo.current) {
        return;
      }

      emailSentTo.current = email;

      if (currentFlow === SignUpFlowNames.PasskeySignupWithEmailOTPFallback) {
        await makeApiCallWithErrorHandler(() => initSignUpWithEmailOTP(email, userName ?? ''));
      } else if (currentFlow === LoginFlowNames.PasskeyLoginWithEmailOTPFallback) {
        await makeApiCallWithErrorHandler(() => initLoginWithEmailOTP(email));
      }
    },
    [email, userName],
  );

  const contextValue = useMemo<UserDataContextProps>(() => {
    return {
      email,
      setEmail,
      userName,
      setUserName,
      emailError,
      setEmailError,
      sendEmail,
    };
  }, [email, userName, emailError, sendEmail]);

  return <UserDataContext.Provider value={contextValue}>{children}</UserDataContext.Provider>;
};

export default UserDataProvider;
