import type {
  IApiService,
  IFlowHandlerConfig,
  LoginFlowNames,
  ProjectConfigRspAllOfData,
  SignUpFlowNames,
} from "@corbado/web-core";
import {
  ApiService,
  defaultTimeout,
  FlowHandlerService,
} from "@corbado/web-core";
import React, {
  createContext,
  type FC,
  useEffect,
  useRef,
  useState,
} from "react";

export interface IAppContext {
  apiService: IApiService;
  flowHandlerService: FlowHandlerService | null;
  projectConfig: ProjectConfigRspAllOfData;
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
  const flowHandlerConfig = {
    passkeyAppend,
    retryPasskeyOnError,
    compulsoryEmailVerification,
    shouldRedirect,
  };
  const apiServiceRef = useRef(ApiService(projectId, apiTimeout));
  const apiService = apiServiceRef.current;
  const [projectConfig, setProjectConfig] = useState(
    {} as ProjectConfigRspAllOfData
  );
  const flowHandlerServiceRef = useRef<FlowHandlerService | null>(null);
  const flowHandlerService = flowHandlerServiceRef.current;

  useEffect(() => {
    apiService.projectsApi
      .projectConfig()
      .then((config) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response = (config.data as any).data as ProjectConfigRspAllOfData;
        setProjectConfig(response);
        flowHandlerServiceRef.current = new FlowHandlerService(
          defaultToLogin ? loginFlowName : signupFlowName,
          projectConfig,
          flowHandlerConfig
        );
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <AppContext.Provider
      value={{ apiService, projectConfig, flowHandlerService }}
    >
      {children}
    </AppContext.Provider>
  );
};
