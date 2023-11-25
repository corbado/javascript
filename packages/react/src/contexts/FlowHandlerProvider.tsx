import { useCorbado } from '@corbado/react-sdk';
import type {
  FlowHandlerEventOptionsInterface,
  FlowHandlerEvents,
  FlowNames,
  IFlowHandlerConfig,
  ScreenNames,
} from '@corbado/web-core';
import { CommonScreens, FlowHandlerService, FlowType, LoginFlowNames, SignUpFlowNames } from '@corbado/web-core';
import type { FC, PropsWithChildren } from 'react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { FlowHandlerContextInterface } from './FlowHandlerContext';
import FlowHandlerContext from './FlowHandlerContext';

type Props = IFlowHandlerConfig;

export const FlowHandlerProvider: FC<PropsWithChildren<Props>> = ({ children, ...props }) => {
  const { getProjectConfig } = useCorbado();
  const [flowHandlerService, setFlowHandlerService] = useState<FlowHandlerService>();
  const [currentScreen, setCurrentScreen] = useState<ScreenNames>(CommonScreens.Start);
  const [currentFlow, setCurrentFlow] = useState<FlowNames>(
    props.initialFlowType === FlowType.Login
      ? LoginFlowNames.PasskeyLoginWithEmailOTPFallback
      : SignUpFlowNames.PasskeySignupWithEmailOTPFallback,
  );
  const initialized = useRef(false);
  const onScreenChangeCbId = useRef<number>(0);
  const onFlowChangeCbId = useRef<number>(0);

  useEffect(() => {
    if (initialized.current) {
      return;
    }
    initialized.current = true;

    void (async () => {
      const projectConfig = await getProjectConfig();
      const flowHandlerService = new FlowHandlerService(projectConfig, props);

      onScreenChangeCbId.current = flowHandlerService.onScreenChange((value: ScreenNames) => setCurrentScreen(value));
      onFlowChangeCbId.current = flowHandlerService.onFlowChange((value: FlowNames) => setCurrentFlow(value));

      flowHandlerService.init();

      setFlowHandlerService(flowHandlerService);

      return () => {
        flowHandlerService?.removeOnFlowChangeCallback(onFlowChangeCbId.current);
        flowHandlerService?.removeOnScreenChangeCallback(onScreenChangeCbId.current);
      };
    })();
  }, []);

  const navigateNext = useCallback(
    (event?: FlowHandlerEvents, eventOptions?: FlowHandlerEventOptionsInterface) => {
      return flowHandlerService?.navigateNext(event, eventOptions) ?? CommonScreens.End;
    },
    [flowHandlerService],
  );

  const peekNext = useCallback(
    (event?: FlowHandlerEvents, eventOptions?: FlowHandlerEventOptionsInterface) => {
      return flowHandlerService?.peekNextScreen(event, eventOptions) ?? CommonScreens.End;
    },
    [flowHandlerService],
  );

  const navigateBack = useCallback(() => {
    return flowHandlerService?.navigateBack() ?? CommonScreens.Start;
  }, [flowHandlerService]);

  const changeFlow = useCallback(
    (flowType: FlowType) => {
      flowHandlerService?.changeFlow(flowType);
    },
    [flowHandlerService],
  );

  const contextValue = useMemo<FlowHandlerContextInterface>(
    () => ({
      currentFlow,
      currentScreen,
      navigateNext,
      peekNext,
      navigateBack,
      changeFlow,
    }),
    [currentFlow, currentScreen, navigateNext, navigateBack, changeFlow],
  );

  return <FlowHandlerContext.Provider value={contextValue}>{children}</FlowHandlerContext.Provider>;
};

export default FlowHandlerProvider;
