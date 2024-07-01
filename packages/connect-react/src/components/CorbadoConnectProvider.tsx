import { CorbadoConnectConfig, CustomThemes } from '@corbado/types';
import { ConnectService } from '@corbado/web-core';
import React, { FC, PropsWithChildren } from 'react';
import SharedProvider from '../contexts/SharedProvider';

export interface CorbadoConnectProviderProps extends CorbadoConnectConfig {
  connectService?: ConnectService;

  customTranslations?: Record<string, object> | null;
  theme?: string | CustomThemes;
}

const CorbadoConnectProvider: FC<PropsWithChildren<CorbadoConnectProviderProps>> = ({
  children,
  customTranslations,
  theme,
  connectService,
  ...configProperties
}) => {
  return (
    <SharedProvider
      connectService={connectService}
      config={configProperties}
    >
      {children}
    </SharedProvider>
  );
};
export default CorbadoConnectProvider;
