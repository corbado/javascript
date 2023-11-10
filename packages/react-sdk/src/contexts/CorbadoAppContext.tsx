import type {
  FlowNames,
  IFlowHandlerConfig,
  IProjectConfig,
  LoginFlowNames,
  ScreenNames,
  SignUpFlowNames,
} from "@corbado/web-core";
import {
  ApiService,
  AuthService,
  CommonScreens,
  defaultTimeout,
  FlowHandlerService,
  ProjectService,
} from "@corbado/web-core";
import React, {
  createContext,
  type FC,
  useEffect,
  useRef,
  useState,
} from "react";

export interface IAppContext {
  projectConfig: IProjectConfig | null;
  authService: AuthService;
  flowHandlerService: FlowHandlerService | null;
  currentScreenName: ScreenNames;
  currentFlowName: FlowNames;
  setCurrentScreenName: React.Dispatch<React.SetStateAction<ScreenNames>>;
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
  //Initializing API Service
  const apiServiceRef = useRef(new ApiService(projectId, apiTimeout));

  //Initializing Project Service
  const projectServiceRef = useRef(new ProjectService(apiServiceRef.current));
  const [projectConfig, setProjectConfig] = useState<IProjectConfig | null>(
    null
  );

  //Initializing Flow Handler Service
  const [flowHandlerService, setFlowHandlerService] =
    useState<FlowHandlerService | null>(null);
  const [currentScreenName, setCurrentScreenName] = useState<ScreenNames>(
    CommonScreens.Start
  );
  const currentFlowName = useRef<FlowNames>(
    defaultToLogin ? loginFlowName : signupFlowName
  );

  //Initializing Auth Service
  const authServiceRef = useRef(new AuthService(apiServiceRef.current));

  useEffect(() => {
    projectServiceRef.current
      .getProjectConfig()
      .then((config) => {
        setProjectConfig(config);

        const newFlowHandlerService = new FlowHandlerService(
          currentFlowName.current,
          config,
          {
            passkeyAppend,
            retryPasskeyOnError,
            compulsoryEmailVerification,
            shouldRedirect,
          }
        );
        setFlowHandlerService(newFlowHandlerService);
        setCurrentScreenName(newFlowHandlerService.currentScreenName);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <AppContext.Provider
      value={{
        projectConfig,
        flowHandlerService,
        currentFlowName: currentFlowName.current,
        currentScreenName,
        setCurrentScreenName,
        authService: authServiceRef.current,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
