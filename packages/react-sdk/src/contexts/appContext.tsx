import type { IApiService, ProjectConfigRspAllOfData } from "@corbado/web-core";
import { ApiService, defaultTimeout } from "@corbado/web-core";
import React, { createContext, type FC, useEffect, useState } from "react";

export interface IAppContext {
  apiService: IApiService;
  projectConfig: ProjectConfigRspAllOfData;
}

export const AppContext = createContext<IAppContext | null>(null);

export const AppProvider: FC<{
  projectId: string;
  apiTimeout: number;
}> = ({ projectId, apiTimeout = defaultTimeout, children }) => {
  const apiService = ApiService(projectId, apiTimeout);
  const [projectConfig, setProjectConfig] = useState(
    {} as ProjectConfigRspAllOfData
  );

  useEffect(() => {
    apiService.projectsApi
      .projectConfig()
      .then((config) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response = (config.data as any).data as ProjectConfigRspAllOfData;
        setProjectConfig(response);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [apiService]);

  return (
    <AppContext.Provider value={{ apiService, projectConfig }}>
      {children}
    </AppContext.Provider>
  );
};
