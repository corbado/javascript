import { useCorbado } from '@corbado/react-sdk';
import type {
  FlowHandlerConfig,
  FlowHandlerEventOptions,
  FlowHandlerEvents,
  FlowNames,
  ScreenNames,
} from '@corbado/shared-ui';
import { CommonScreens, FlowHandler, FlowType, LoginFlowNames, SignUpFlowNames } from '@corbado/shared-ui';
import type { FC, PropsWithChildren } from 'react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { FlowHandlerContextProps } from './FlowHandlerContext';
import FlowHandlerContext from './FlowHandlerContext';

type Props = FlowHandlerConfig;

export const FlowHandlerProvider: FC<PropsWithChildren<Props>> = ({ children, ...props }) => {
  const { getProjectConfig } = useCorbado();
  const [flowHandler, setFlowHandler] = useState<FlowHandler>();
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
      const flowHandler = new FlowHandler(projectConfig, props);

      onScreenChangeCbId.current = flowHandler.onScreenChange((value: ScreenNames) => setCurrentScreen(value));
      onFlowChangeCbId.current = flowHandler.onFlowChange((value: FlowNames) => setCurrentFlow(value));

      flowHandler.init();

      setFlowHandler(flowHandler);

      return () => {
        flowHandler?.removeOnFlowChangeCallback(onFlowChangeCbId.current);
        flowHandler?.removeOnScreenChangeCallback(onScreenChangeCbId.current);
      };
    })();
  }, []);

  const navigateNext = useCallback(
    (event?: FlowHandlerEvents, eventOptions?: FlowHandlerEventOptions) => {
      return flowHandler?.navigateNext(event, eventOptions) ?? CommonScreens.End;
    },
    [flowHandler],
  );

  const peekNext = useCallback(
    (event?: FlowHandlerEvents, eventOptions?: FlowHandlerEventOptions) => {
      return flowHandler?.peekNextScreen(event, eventOptions) ?? CommonScreens.End;
    },
    [flowHandler],
  );

  const navigateBack = useCallback(() => {
    return flowHandler?.navigateBack() ?? CommonScreens.Start;
  }, [flowHandler]);

  const changeFlow = useCallback(
    (flowType: FlowType) => {
      flowHandler?.changeFlow(flowType);
    },
    [flowHandler],
  );

  const contextValue = useMemo<FlowHandlerContextProps>(
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
