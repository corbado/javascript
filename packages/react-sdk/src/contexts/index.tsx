import type { FC } from "react";
import React from "react";

import { AppProvider } from "./appContext";

export interface ICorbadoContextParams {
  projectId: string;
  apiTimeout: number;
}

export const CorbadoProvider: FC<ICorbadoContextParams> = ({
  projectId,
  apiTimeout,
  children,
}) => {
  return (
    <AppProvider projectId={projectId} apiTimeout={apiTimeout}>
      {children}
    </AppProvider>
  );
};
