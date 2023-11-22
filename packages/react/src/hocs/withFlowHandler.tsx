import { CommonScreens } from '@corbado/web-core';
import React from 'react';

import type { ScreenMap } from '../flows';
import useFlowHandler from '../hooks/useFlowHandler';

export function withFlowScreen(ComponentMap: ScreenMap) {
  return function FlowScreenWrapper(props: React.JSX.IntrinsicAttributes) {
    const { currentScreen } = useFlowHandler();

    // Get the component corresponding to the current screen from the map
    const ScreenComponent = ComponentMap[currentScreen];

    const EndComponent = () => {
      const EndComponentScreen = ComponentMap[CommonScreens.End];
      return EndComponentScreen ? <EndComponentScreen /> : null;
    };

    // Render the component if it exists, otherwise a fallback or null
    return ScreenComponent ? <ScreenComponent {...props} /> : <EndComponent />;
  };
}
