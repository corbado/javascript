import type {
  IFlowHandlerConfig,
  LoginFlowNames,
  SignUpFlowNames,
} from "@corbado/web-core";
import { defaultTimeout } from "@corbado/web-core";
import type { FC } from "react";
import React from "react";

import { AppProvider } from "./appContext";

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
  defaultToLogin,
  signupFlowName,
  loginFlowName,
  passkeyAppend,
  retryPasskeyOnError,
  compulsoryEmailVerification,
  shouldRedirect,
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
