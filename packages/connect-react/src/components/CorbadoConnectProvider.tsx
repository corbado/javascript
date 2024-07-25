import type { CorbadoConnectConfig, CustomThemes } from '@corbado/types';
import type { ConnectService } from '@corbado/web-core';
import type { FC, PropsWithChildren } from 'react';
import React, { useEffect, useRef, useState } from 'react';

import ModalProvider from '../contexts/ModalProvider';
import SharedProvider from '../contexts/SharedProvider';
import CorbadoConnectModal from './CorbadoConnectModal';

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
  enableHighlight,
  ...configProperties
}) => {
  const [connectContainerHeight, setConnectContainerHeight] = useState(0);

  useEffect(() => {
    const targetElement = document.getElementsByClassName('cb-connect-container')[0];

    if (targetElement) {
      const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
          if (entry.target === targetElement) {
            setConnectContainerHeight(entry.contentRect.height);
          }
        }
      });
      resizeObserver.observe(targetElement);

      return () => {
        resizeObserver.unobserve(targetElement);
      };
    }

    return () => {};
  }, []);

  return (
    <SharedProvider
      connectService={connectService}
      config={configProperties}
    >
      <ModalProvider>
        {!isWebJs && <CorbadoConnectModal />}
        <div className={enableHighlight && connectContainerHeight ? 'cb-highlight' : undefined}>{children}</div>
      </ModalProvider>
    </SharedProvider>
  );
};
export default CorbadoConnectProvider;
