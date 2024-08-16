import type { CorbadoConnectConfig, CustomThemes } from '@corbado/types';
import type { ConnectService } from '@corbado/web-core';
import type { FC, PropsWithChildren } from 'react';
import React, { useEffect, useState } from 'react';

import ModalProvider from '../contexts/ModalProvider';
import SharedProvider from '../contexts/SharedProvider';
import CorbadoConnectModal from './shared/CorbadoConnectModal';

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
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [connectContainerHeight, setConnectContainerHeight] = useState(0);

  useEffect(() => {
    if (!enableHighlight || !containerRef.current) {
      return;
    }

    const targetElement = containerRef.current.querySelector('.cb-connect-container')!;

    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        if (entry.target === targetElement) {
          setConnectContainerHeight(entry.contentRect.height);
        }
      }
    });

    resizeObserver.observe(targetElement);

    return () => {
      if (targetElement) {
        resizeObserver.unobserve(targetElement);
      }
    };
  }, [enableHighlight, containerRef]);

  return (
    <SharedProvider
      connectService={connectService}
      config={configProperties}
    >
      <ModalProvider>
        {!isWebJs && <CorbadoConnectModal />}
        <div
          className={enableHighlight && connectContainerHeight ? 'cb-highlight' : undefined}
          ref={containerRef}
        >
          {children}
        </div>
      </ModalProvider>
    </SharedProvider>
  );
};
export default CorbadoConnectProvider;
