import { useCorbado } from '@corbado/react-sdk';
import type { FlowHandlerEventOptions, FlowHandlerEvents, FlowNames, ScreenNames, UserState } from '@corbado/shared-ui';
import { CommonScreens, FlowHandler, SignUpFlowNames } from '@corbado/shared-ui';
import type { FlowStyles } from '@corbado/types';
import i18n from 'i18next';
import type { FC, PropsWithChildren } from 'react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { FlowHandlerContextProps } from './FlowHandlerContext';
import FlowHandlerContext from './FlowHandlerContext';

type Props = {
  onLoggedIn: () => void;
};

export const FlowHandlerProvider: FC<PropsWithChildren<Props>> = ({ children, ...props }) => {
  const { corbadoApp, getProjectConfig, user } = useCorbado();
  const [flowHandler, setFlowHandler] = useState<FlowHandler>();
  const [currentScreen, setCurrentScreen] = useState<ScreenNames>(CommonScreens.Start);
  const [currentUserState, setCurrentUserState] = useState<UserState>({});
  const [currentFlow, setCurrentFlow] = useState<FlowNames>(SignUpFlowNames.PasskeySignupWithEmailOTPFallback);
  const [currentFlowStyle, setCurrentFlowStyle] = useState<FlowStyles>('PasskeyWithEmailOTPFallback');
  const [initialized, setInitialized] = useState(false);
  const onScreenChangeCbId = useRef<number>(0);
  const onFlowChangeCbId = useRef<number>(0);
  const onUserStateChangeCbId = useRef<number>(0);

  useEffect(() => {
    if (initialized) {
      return;
    }

    void (async () => {
      const projectConfig = await getProjectConfig();
      if (projectConfig.err) {
        // currently there are no errors that can be thrown here
        return;
      }
      const flowHandler = new FlowHandler(projectConfig.val, props.onLoggedIn);

      onScreenChangeCbId.current = flowHandler.onScreenChange((value: ScreenNames) => setCurrentScreen(value));
      onFlowChangeCbId.current = flowHandler.onFlowChange((value: FlowNames) => {
        setCurrentFlow(value);
        setCurrentFlowStyle(flowHandler.currentFlowStyle);
      });
      onUserStateChangeCbId.current = flowHandler.onUserStateChange((value: UserState) => {
        setCurrentUserState(value);
      });

      await flowHandler.init(corbadoApp, i18n);
      setFlowHandler(flowHandler);
      setInitialized(true);
    })();

    return () => {
      flowHandler?.removeOnFlowChangeCallback(onFlowChangeCbId.current);
      flowHandler?.removeOnScreenChangeCallback(onScreenChangeCbId.current);
      flowHandler?.removeOnUserStateChange(onUserStateChangeCbId.current);
    };
  }, []);

  useEffect(() => {
    if (!initialized || !user) {
      return;
    }

    flowHandler?.update(user);
  }, [initialized, user]);

  const navigateBack = useCallback(() => {
    return flowHandler?.navigateBack() ?? CommonScreens.Start;
  }, [flowHandler]);

  const emitEvent = useCallback(
    (event?: FlowHandlerEvents, eventOptions?: FlowHandlerEventOptions) => {
      return flowHandler?.handleStateUpdate(event, eventOptions);
    },
    [flowHandler],
  );

  const contextValue = useMemo<FlowHandlerContextProps>(
    () => ({
      currentFlow,
      currentScreen,
      currentUserState,
      currentFlowStyle,
      initialized,
      navigateBack,
      emitEvent,
    }),
    [currentFlow, currentScreen, currentUserState, initialized, navigateBack],
  );

  return <FlowHandlerContext.Provider value={contextValue}>{children}</FlowHandlerContext.Provider>;
};

export default FlowHandlerProvider;
