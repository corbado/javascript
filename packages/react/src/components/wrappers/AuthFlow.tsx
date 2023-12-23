import { useCorbado } from '@corbado/react-sdk';
import { CommonScreens } from '@corbado/shared-ui';
import type { FC } from 'react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import type { ScreenMap } from '../../flows';
import { flowScreensMap } from '../../flows';
import useFlowHandler from '../../hooks/useFlowHandler';
import Loading from '../../screens/Loading';
import { ErrorBoundary } from './ErrorBoundary';

interface AuthFlowProps {
  isDevMode: boolean;
  customerSupportEmail: string;
}

export const AuthFlow: FC<AuthFlowProps> = ({ isDevMode, customerSupportEmail }) => {
  const { currentFlow, currentScreen, initialized } = useFlowHandler();
  const { globalError } = useCorbado();
  const [ComponentMap, setComponentMap] = useState<ScreenMap>({});

  useEffect(() => {
    const screensMap = flowScreensMap[currentFlow];
    setComponentMap(screensMap ?? {});
  }, [currentFlow]);

  const ScreenComponent = useMemo(() => ComponentMap[currentScreen], [ComponentMap, currentScreen]);

  const EndComponent = useCallback(() => {
    const EndComponentScreen = ComponentMap[CommonScreens.End];
    return EndComponentScreen ? <EndComponentScreen /> : null;
  }, [ComponentMap]);

  // TODO: Improve loading component
  // Render the component if it exists, otherwise a fallback or null
  return (
    <ErrorBoundary
      globalError={globalError}
      isDevMode={isDevMode}
      customerSupportEmail={customerSupportEmail}
    >
      {initialized ? ScreenComponent ? <ScreenComponent /> : <EndComponent /> : <Loading />}
    </ErrorBoundary>
  );
};
