import { useCorbado } from '@corbado/react-sdk';
import { ScreenNames } from '@corbado/shared-ui';
import type { FC } from 'react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import type { ScreenMap } from '../../flows';
import { flowScreensMap } from '../../flows';
import useErrorHandling from '../../hooks/useErrorHandling';
import useFlowHandler from '../../hooks/useFlowHandler';
import Loading from '../ui/Loading';
import { ErrorBoundary } from './ErrorBoundary';

export const AuthFlow: FC = () => {
  const { isDevMode, customerSupportEmail } = useErrorHandling();
  const { currentFlow, currentScreen, initialized } = useFlowHandler();
  const { globalError } = useCorbado();
  const [componentMap, setComponentMap] = useState<ScreenMap>({});

  useEffect(() => {
    if (!currentFlow) {
      return;
    }

    const screensMap = flowScreensMap[currentFlow];
    setComponentMap(screensMap ?? {});
  }, [currentFlow]);

  const ScreenComponent = useMemo(() => {
    if (!currentScreen) {
      return null;
    }

    return componentMap[currentScreen];
  }, [componentMap, currentScreen]);

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
