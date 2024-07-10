import type { CorbadoConnectConfig, CustomThemes } from '@corbado/types';
import type { ConnectService } from '@corbado/web-core';
import type { FC, PropsWithChildren } from 'react';
import React from 'react';

import ModalProvider from '../contexts/ModalProvider';
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
      <ModalProvider>{children}</ModalProvider>
    </SharedProvider>
  );
};
export default CorbadoConnectProvider;
