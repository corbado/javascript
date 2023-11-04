import type {
  IFlowHandlerConfig,
  LoginFlowNames,
  SignUpFlowNames,
} from "@corbado/web-core";
import { defaultTimeout } from "@corbado/web-core";
import type { FC } from "react";
import React from "react";

import { AppProvider } from "./appContext";
import { AuthContextProvider } from "./authContext";

export interface ICorbadoContextParams extends IFlowHandlerConfig {
  projectId: string;
  apiTimeout?: number;
  defaultToLogin: boolean;
  signupFlowName: SignUpFlowNames;
  loginFlowName: LoginFlowNames;
}

export const CorbadoProvider: FC<ICorbadoContextParams> = ({
  projectId,
  apiTimeout = defaultTimeout,
  defaultToLogin = false,
  signupFlowName = "EmailOTPSignup",
  loginFlowName = "PasskeyLoginWithEmailOTPFallback",
  passkeyAppend = false,
  retryPasskeyOnError = false,
  compulsoryEmailVerification = false,
  shouldRedirect = true,
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
      <AuthContextProvider>{children}</AuthContextProvider>
    </AppProvider>
  );
};
