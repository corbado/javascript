import type { CorbadoConnectConfig, CustomThemes } from '@corbado/types';
import type { ConnectService } from '@corbado/web-core';
import type { FC, PropsWithChildren } from 'react';
import React from 'react';

import SharedProvider from '../contexts/SharedProvider';
import ModalProvider from '../contexts/ModalProvider';

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
    <ModalProvider>
      <SharedProvider
        connectService={connectService}
        config={configProperties}
      >
        {children}
      </SharedProvider>
    </ModalProvider>
  );
};
export default CorbadoConnectProvider;
