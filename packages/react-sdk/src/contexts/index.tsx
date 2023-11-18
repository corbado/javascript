import {
  defaultTimeout,
  LoginFlowNames,
  SignUpFlowNames,
} from "@corbado/web-core";
import type { FC, PropsWithChildren } from "react";
import React from "react";

import { AppProvider, type IAppProviderParams } from "./CorbadoAppContext";

export type ICorbadoContextParams = PropsWithChildren<IAppProviderParams>;

export const CorbadoProvider: FC<ICorbadoContextParams> = ({
  projectId,
  apiTimeout = defaultTimeout,
  defaultToLogin = false,
  signupFlowName = SignUpFlowNames.EmailOTPSignup,
  loginFlowName = LoginFlowNames.PasskeyLoginWithEmailOTPFallback,
  passkeyAppend = false,
  retryPasskeyOnError = false,
  compulsoryEmailVerification = false,
  shouldRedirect = false,
  children,
}) => {
  return (
    <AppProvider
      projectId={projectId}
      apiTimeout={apiTimeout}
      defaultToLogin={defaultToLogin}
      signupFlowName={signupFlowName}
      loginFlowName={loginFlowName}
      passkeyAppend={passkeyAppend}
      retryPasskeyOnError={retryPasskeyOnError}
      compulsoryEmailVerification={compulsoryEmailVerification}
      shouldRedirect={shouldRedirect}
    >
      {children}
    </AppProvider>
  );
};
