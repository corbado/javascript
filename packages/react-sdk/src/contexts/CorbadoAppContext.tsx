import type {
  AuthService,
  FlowHandlerService,
  IFlowHandlerConfig,
  IProjectConfig,
  LoginFlowNames,
  SignUpFlowNames,
} from "@corbado/web-core";
import { CorbadoApp } from "@corbado/web-core";
import React, { createContext, type FC, useRef, useState } from "react";

export interface IAppContext {
  getProjectConfig: () => IProjectConfig | null;
  authService: AuthService;
  flowHandlerService: FlowHandlerService | null;
}

export interface IAppProviderParams extends IFlowHandlerConfig {
  projectId: string;
  apiTimeout?: number;
  defaultToLogin: boolean;
  signupFlowName: SignUpFlowNames;
  loginFlowName: LoginFlowNames;
}

export const AppContext = createContext<IAppContext | null>(null);

export const AppProvider: FC<IAppProviderParams> = ({
  children,
  ...corbadoParams
}) => {
  //Initializing Corbado Application
  const corbadoApp = useRef(new CorbadoApp(corbadoParams));
  const projectService = corbadoApp.current.projectService;
  const [flowHandlerService, setFlowHandlerService] = useState(
    corbadoApp.current.flowHandlerService
  );
  const authService = corbadoApp.current.authService;

  //On init
  corbadoApp.current.onInit((app) => {
    setFlowHandlerService(app.flowHandlerService);
  });

  //Get project config
  function getProjectConfig() {
    return projectService.projConfig;
  }

  return (
    <AppContext.Provider
      value={{
        getProjectConfig,
        flowHandlerService,
        authService,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
