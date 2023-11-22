import React from 'react';

import { flowScreensMap } from '../flows';
import useFlowHandler from '../hooks/useFlowHandler';

export const ScreensFlow = () => {
  const { currentFlow, currentScreen } = useFlowHandler();

  if (!currentFlow || !currentScreen) {
    return null;
  }

  const Screen = flowScreensMap[currentFlow]?.[currentScreen] as React.FC;
  console.log('ScreensFlow', Screen);
  return <Screen />;
};
