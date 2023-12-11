import { useCorbado } from '@corbado/react-sdk';
import type { FlowNames } from '@corbado/shared-ui';
import { LoginFlowNames, SignUpFlowNames } from '@corbado/shared-ui';
import type { PropsWithChildren } from 'react';
import React, { useCallback, useMemo, useRef, useState } from 'react';

import type { UserDataContextProps } from './UserDataContext';
import { UserDataContext } from './UserDataContext';

export const UserDataProvider = ({ children }: PropsWithChildren) => {
  const { initLoginWithEmailOTP, initSignUpWithEmailOTP } = useCorbado();
  const [email, setEmail] = useState<string>();
  const [userName, setUserName] = useState<string>();
  const emailSentTo = useRef<string>();

  const sendEmail = useCallback(
    (currentFlow: FlowNames) => {
      if (!email || email === emailSentTo.current) {
        return;
      }

      if (currentFlow === SignUpFlowNames.PasskeySignupWithEmailOTPFallback) {
        void initSignUpWithEmailOTP(email, userName ?? '');
      } else if (currentFlow === LoginFlowNames.PasskeyLoginWithEmailOTPFallback) {
        void initLoginWithEmailOTP(email);
      }
      emailSentTo.current = email;
    },
    [email, userName],
  );

  const contextValue = useMemo<UserDataContextProps>(() => {
    return {
      email,
      setEmail,
      userName,
      setUserName,
      sendEmail,
    };
  }, [email, userName, sendEmail]);

  return <UserDataContext.Provider value={contextValue}>{children}</UserDataContext.Provider>;
};

export default UserDataProvider;
