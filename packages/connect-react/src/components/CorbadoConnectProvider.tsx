import type { CorbadoConnectConfig, CustomThemes } from '@corbado/types';
import type { ConnectService } from '@corbado/web-core';
import type { FC, PropsWithChildren } from 'react';
import React, { useEffect } from 'react';

import ModalProvider from '../contexts/ModalProvider';
import SharedProvider from '../contexts/SharedProvider';
import CorbadoConnectModal from './CorbadoConnectModal';

import FingerprintJS from '@fingerprintjs/fingerprintjs';

export interface CorbadoConnectProviderProps extends CorbadoConnectConfig {
  connectService?: ConnectService;
  customTranslations?: Record<string, object> | null;
  theme?: string | CustomThemes;
  isWebJs?: boolean;
}

const CorbadoConnectProvider: FC<PropsWithChildren<CorbadoConnectProviderProps>> = ({
  children,
  customTranslations,
  theme,
  connectService,
  isWebJs = false,
  ...configProperties
}) => {
  useEffect(() => {
    const setFp = async () => {
      const fp = await FingerprintJS.load();

      const visitor = await fp.get();

      console.log('Visitor', visitor);
    };

    setFp();
  }, []);

  return (
    <SharedProvider
      connectService={connectService}
      config={configProperties}
    >
      <ModalProvider>
        {!isWebJs && <CorbadoConnectModal />}
        {children}
      </ModalProvider>
    </SharedProvider>
  );
};
export default CorbadoConnectProvider;
