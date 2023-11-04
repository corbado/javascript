import type {
  FlowNames,
  IApiService,
  IFlowHandlerConfig,
  LoginFlowNames,
  ProjectConfigRspAllOfData,
  ScreenNames,
  SignUpFlowNames,
  StepFunctionParams,
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
  projectConfig: ProjectConfigRspAllOfData;
  currentScreenName: ScreenNames;
  currentFlowName: FlowNames;
  navigateToNextScreen: (...userInputs: StepFunctionParams[]) => void;
  navigateBack: () => void;
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
  const [flowHandlerService, setFlowHandlerService] =
    useState<FlowHandlerService | null>(null);
  const [currentScreenName, setCurrentScreenName] =
    useState<ScreenNames>("start");
  const currentFlowName = useRef<FlowNames>(
    defaultToLogin ? loginFlowName : signupFlowName
  );

  useEffect(() => {
    apiService.projectsApi
      .projectConfig()
      .then((config) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response = (config.data as any).data as ProjectConfigRspAllOfData;
        setProjectConfig(response);
        const newFlowHandlerServiceRef = new FlowHandlerService(
          currentFlowName.current,
          projectConfig,
          flowHandlerConfig
        );
        setFlowHandlerService(newFlowHandlerServiceRef);
        setCurrentScreenName(newFlowHandlerServiceRef.currentScreenName);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const navigateToNextScreen = (...userInputs: StepFunctionParams[]) => {
    if (!flowHandlerService) {
      return;
    }

    const nextScreen = flowHandlerService.navigateToNextScreen(...userInputs);
    setCurrentScreenName(nextScreen);
  };

  const navigateBack = () => {
    if (!flowHandlerService) {
      return;
    }

    const prevScreen = flowHandlerService.navigateBack();
    setCurrentScreenName(prevScreen);
  };

  return (
    <AppContext.Provider
      value={{
        apiService,
        projectConfig,
        currentFlowName: currentFlowName.current,
        currentScreenName,
        navigateToNextScreen,
        navigateBack,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
