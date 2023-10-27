import type { IApiService } from "@corbado/web-core";
import { ApiService, defaultTimeout } from "@corbado/web-core";
import React, { createContext, type FC } from "react";

export interface IAppContext {
  apiService: IApiService;
}

export const AppContext = createContext<IAppContext | null>(null);

export const AppProvider: FC<{
  projectId: string;
  apiTimeout: number;
}> = ({ projectId, apiTimeout = defaultTimeout, children }) => {
  const apiService = ApiService(projectId, apiTimeout);
  return (
    <AppContext.Provider value={{ apiService }}>{children}</AppContext.Provider>
  );
};
