import type {
  AuthService,
  FlowHandlerService,
  ICorbadoAppParams,
  IProjectConfig,
  ProjectService,
} from "@corbado/web-core";
import { SessionService } from "@corbado/web-core";
import { CorbadoApp } from "@corbado/web-core";
import React, {
  createContext,
  type FC,
  type PropsWithChildren,
  useEffect,
  useState,
} from "react";

export interface IAppContext {
  projectId: string;
  authService: AuthService | null;
  flowHandlerService: FlowHandlerService | null;
  sessionService: SessionService | null;
  getProjectConfig: () => IProjectConfig | null;
  onSignOut: () => void;
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
    const [sessionService, setSessionService] = useState<SessionService | null>(
      null
    );

    useEffect(() => {
      if (SessionService.isSessionActive()) {
        //Session is active, not initializing Corbado App"
        return;
      }

      setCorbadoApp(new CorbadoApp(corbadoParams));
    }, []);

    useEffect(() => {
      if (!corbadoApp) {
        return;
      }

      setProjectService(corbadoApp.projectService);
      setFlowHandlerService(corbadoApp.flowHandlerService);
      setAuthService(corbadoApp.authService);
      setSessionService(corbadoApp.sessionService);

      corbadoApp.onInit((app) => {
        setFlowHandlerService(app.flowHandlerService);
      });

      return () => {
        console.log("Destroying Corbado App - useEffect");
        corbadoApp?.destroy();
      };
    }, [corbadoApp]);

    function getProjectConfig() {
      return projectService?.projConfig ?? null;
    }

    function onSignOut() {
      setCorbadoApp(new CorbadoApp(corbadoParams));
    }

    return (
      <AppContext.Provider
        value={{
          projectId: corbadoParams.projectId,
          flowHandlerService,
          authService,
          sessionService,
          getProjectConfig,
          onSignOut,
        }}
      >
        {children}
      </AppContext.Provider>
    );
  },
  (prevProps, nextProps) => prevProps.projectId === nextProps.projectId
);
