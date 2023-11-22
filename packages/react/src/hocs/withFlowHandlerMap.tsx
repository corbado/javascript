import { CommonScreens } from '@corbado/web-core';
import type { JSX, PropsWithChildren } from 'react';
import React, { useCallback, useMemo } from 'react';

import type { ScreenMap } from '../flows';
import useFlowHandler from '../hooks/useFlowHandler';

export function withFlowScreenMap(ComponentMap: ScreenMap | undefined) {
  if (!ComponentMap) {
    return () => null;
  }

  return function FlowScreenWrapper({ children, ...props }: PropsWithChildren<JSX.IntrinsicAttributes>) {
    const { currentScreen } = useFlowHandler();

    // Get the component corresponding to the current screen from the map
    const ScreenComponent = useMemo(() => ComponentMap[currentScreen], [ComponentMap, currentScreen]);

    const EndComponent = useCallback(() => {
      const EndComponentScreen = ComponentMap[CommonScreens.End];
      return EndComponentScreen ? <EndComponentScreen /> : null;
    }, [ComponentMap]);

    // Render the component if it exists, otherwise a fallback or null
    return ScreenComponent ? <ScreenComponent {...props}>{children}</ScreenComponent> : <EndComponent />;
  };
}
