import type { ICorbadoAppParams } from "@corbado/web-core";
import { LoginFlowNames, SignUpFlowNames } from "@corbado/web-core";
import { defaultTimeout } from "@corbado/web-core";
import type { FC, PropsWithChildren } from "react";
import React from "react";

import { AppProvider } from "./CorbadoAppContext";

export type ICorbadoContextParams = ICorbadoAppParams;

export const CorbadoProvider: FC<PropsWithChildren<ICorbadoContextParams>> = ({
  projectId,
  apiTimeout = defaultTimeout,
  defaultToLogin = false,
  signupFlowName = SignUpFlowNames.EmailOTPSignup,
  loginFlowName = LoginFlowNames.PasskeyLoginWithEmailOTPFallback,
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
      {children}
    </AppProvider>
  );
};
