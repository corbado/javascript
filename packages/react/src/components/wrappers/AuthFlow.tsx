import { CommonScreens } from '@corbado/shared-ui';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import type { ScreenMap } from '../../flows';
import { flowScreensMap } from '../../flows';
import useFlowHandler from '../../hooks/useFlowHandler';

export const AuthFlow = () => {
  const { currentFlow, currentScreen } = useFlowHandler();
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

  // Render the component if it exists, otherwise a fallback or null
  return ScreenComponent ? <ScreenComponent /> : <EndComponent />;
};
