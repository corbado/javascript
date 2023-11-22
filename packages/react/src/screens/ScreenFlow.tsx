import type { JSX, PropsWithChildren, ReactNode } from 'react';
import React, { useEffect, useState } from 'react';

import { flowScreensMap } from '../flows';
import { withFlowScreenMap } from '../hocs/withFlowHandlerMap';
import useFlowHandler from '../hooks/useFlowHandler';

export const ScreensFlow = ({ children, ...props }: PropsWithChildren<JSX.IntrinsicAttributes>) => {
  const { currentFlow } = useFlowHandler();
  const [Screen, setScreenMap] = useState<(props: JSX.IntrinsicAttributes) => ReactNode | null>(() => null);

  useEffect(() => {
    const screensMap = flowScreensMap[currentFlow];
    const FlowScreenHOC = withFlowScreenMap(screensMap);
    setScreenMap(FlowScreenHOC);
  }, [currentFlow]);

  return <Screen {...props}>{children}</Screen>;
};
