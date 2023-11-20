import { useCorbado } from '@corbado/react-sdk';
import type { FlowNames, FlowType, IFlowHandlerConfig, ScreenNames } from '@corbado/web-core';
import { FlowHandlerService } from '@corbado/web-core';
import type { FC, PropsWithChildren } from 'react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { FlowHandlerContextInterface } from './FlowHandlerContext';
import FlowHandlerContext from './FlowHandlerContext';

type Props = IFlowHandlerConfig;

export const FlowHandlerProvider: FC<PropsWithChildren<Props>> = ({ children, ...props }) => {
  const { getProjectConfig } = useCorbado();
  const [flowHandlerService, setFlowHandlerService] = useState<FlowHandlerService>();
  const initialized = useRef(false);
  const [currentScreen, setCurrentScreen] = useState<ScreenNames>();
  const [currentFlow, setCurrentFlow] = useState<FlowNames>();

  useEffect(() => {
    if (initialized.current) {
      return;
    }
    initialized.current = true;

    const init = async () => {
      const projectConfig = await getProjectConfig();
      const flowHandlerService = new FlowHandlerService(projectConfig, props);

      flowHandlerService.onScreenChange((value: ScreenNames) => setCurrentScreen(value));
      flowHandlerService.onFlowChange((value: FlowNames) => setCurrentFlow(value));

      flowHandlerService.init();

      setFlowHandlerService(flowHandlerService);
    };

    void init();
  }, []);

  const navigateNext = useCallback(
    async (event?: string) => {
      await flowHandlerService?.navigateNext(event);
    },
    [flowHandlerService],
  );

  const navigateBack = useCallback(() => {
    flowHandlerService?.navigateBack();
  }, [flowHandlerService]);

  const changeFlow = useCallback(
    (flowType: FlowType) => {
      flowHandlerService?.changeFlow(flowType);
    },
    [flowHandlerService],
  );

  const contextValue = useMemo<FlowHandlerContextInterface>(() => {
    return {
      currentFlow,
      currentScreen,
      navigateNext,
      navigateBack,
      changeFlow,
    };
  }, [currentFlow, currentScreen, navigateNext, navigateBack, changeFlow]);

  return <FlowHandlerContext.Provider value={contextValue}>{children}</FlowHandlerContext.Provider>;
};

export default FlowHandlerProvider;
