import { useCorbado } from '@corbado/react-sdk';
import { ScreenNames } from '@corbado/shared-ui';
import type { FC } from 'react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import type { ScreenMap } from '../../flows';
import { flowScreensMap } from '../../flows';
import useFlowHandler from '../../hooks/useFlowHandler';
import Loading from '../../screens/authentication/Loading';
import { ErrorBoundary } from './ErrorBoundary';

interface AuthFlowProps {
  isDevMode: boolean;
  customerSupportEmail: string;
}

export const AuthFlow: FC<AuthFlowProps> = ({ isDevMode, customerSupportEmail }) => {
  const { currentFlow, currentScreen, initialized } = useFlowHandler();
  const { globalError } = useCorbado();
  const [componentMap, setComponentMap] = useState<ScreenMap>({});

  useEffect(() => {
    const screensMap = flowScreensMap[currentFlow];
    setComponentMap(screensMap ?? {});
  }, [currentFlow]);

  const ScreenComponent = useMemo(() => componentMap[currentScreen], [componentMap, currentScreen]);

  const EndComponent = useCallback(() => {
    const EndComponentScreen = componentMap[ScreenNames.End];
    return EndComponentScreen ? <EndComponentScreen /> : null;
  }, [componentMap]);

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
