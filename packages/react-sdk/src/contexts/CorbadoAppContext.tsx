import type {
  AuthService,
  FlowHandlerService,
  ICorbadoAppParams,
  IProjectConfig,
  ProjectService,
} from "@corbado/web-core";
import { CorbadoApp } from "@corbado/web-core";
import React, {
  createContext,
  type FC,
  type PropsWithChildren,
  useEffect,
  useState,
} from "react";

export interface IAppContext {
  getProjectConfig: () => IProjectConfig | null;
  authService: AuthService | null;
  flowHandlerService: FlowHandlerService | null;
}

export type IAppProviderParams = PropsWithChildren<ICorbadoAppParams>;

export const AppContext = createContext<IAppContext | null>(null);

export const AppProvider: FC<IAppProviderParams> = React.memo(
  ({ children, ...corbadoParams }) => {
    //Initializing Corbado Application
    const [corbadoApp, setCorbadoApp] = useState<CorbadoApp | null>(null);
    const [projectService, setProjectService] = useState<ProjectService | null>(
      null
    );
    const [flowHandlerService, setFlowHandlerService] =
      useState<FlowHandlerService | null>(null);
    const [authService, setAuthService] = useState<AuthService | null>(null);

    useEffect(() => {
      setCorbadoApp(new CorbadoApp(corbadoParams));

      return () => {
        console.log("Destroying Corbado App - useEffect");
        corbadoApp?.destroy();
      };
    }, []);

    useEffect(() => {
      if (!corbadoApp) {
        return;
      }

      setProjectService(corbadoApp.projectService);
      setFlowHandlerService(corbadoApp.flowHandlerService);
      setAuthService(corbadoApp.authService);

      corbadoApp.onInit((app) => {
        setFlowHandlerService(app.flowHandlerService);
      });
    }, [corbadoApp]);

    function getProjectConfig() {
      return projectService?.projConfig ?? null;
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
  },
  (prevProps, nextProps) => prevProps.projectId === nextProps.projectId
);
