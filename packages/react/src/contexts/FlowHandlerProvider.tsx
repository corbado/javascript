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

import useUserData from '../hooks/useUserData';
import type { FlowHandlerContextInterface } from './FlowHandlerContext';
import FlowHandlerContext from './FlowHandlerContext';

type Props = IFlowHandlerConfig;

export const FlowHandlerProvider: FC<PropsWithChildren<Props>> = ({ children, ...props }) => {
  const { getProjectConfig, initSignUpWithEmailOTP } = useCorbado();
  const { email, userName } = useUserData();
  const [flowHandlerService, setFlowHandlerService] = useState<FlowHandlerService>();
  const initialized = useRef(false);
  const [currentScreen, setCurrentScreen] = useState<ScreenNames>(CommonScreens.Start);
  const [currentFlow, setCurrentFlow] = useState<FlowNames>(
    props.initialFlowType === FlowType.Login
      ? LoginFlowNames.PasskeyLoginWithEmailOTPFallback
      : SignUpFlowNames.PasskeySignupWithEmailOTPFallback,
  );

  useEffect(() => {
    if (initialized.current) {
      return;
    }
    initialized.current = true;

    void (async () => {
      const projectConfig = await getProjectConfig();
      const flowHandlerService = new FlowHandlerService(projectConfig, props);

      flowHandlerService.onScreenChange((value: ScreenNames) => {
        setCurrentScreen(value);

        if (value === CommonScreens.EnterOtp && email && userName) {
          void initSignUpWithEmailOTP(email, userName);
        }
      });
      flowHandlerService.onFlowChange((value: FlowNames) => setCurrentFlow(value));

      flowHandlerService.init();

      setFlowHandlerService(flowHandlerService);
    })();
  }, []);

  const navigateNext = useCallback(
    (event?: FlowHandlerEvents, eventOptions?: FlowHandlerEventOptionsInterface) => {
      return flowHandlerService?.navigateNext(event, eventOptions) ?? CommonScreens.End;
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
      navigateBack,
      changeFlow,
    }),
    [currentFlow, currentScreen, navigateNext, navigateBack, changeFlow],
  );

  return <FlowHandlerContext.Provider value={contextValue}>{children}</FlowHandlerContext.Provider>;
};

export default FlowHandlerProvider;