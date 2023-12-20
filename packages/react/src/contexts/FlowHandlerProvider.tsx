import { useCorbado } from '@corbado/react-sdk';
import type {
  FlowHandlerConfig,
  FlowHandlerEventOptions,
  FlowHandlerEvents,
  FlowNames,
  ScreenNames,
  UserState,
} from '@corbado/shared-ui';
import { CommonScreens, FlowHandler, FlowType, LoginFlowNames, SignUpFlowNames } from '@corbado/shared-ui';
import i18n from 'i18next';
import type { FC, PropsWithChildren } from 'react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { FlowHandlerContextProps } from './FlowHandlerContext';
import FlowHandlerContext from './FlowHandlerContext';

type Props = FlowHandlerConfig;

export const FlowHandlerProvider: FC<PropsWithChildren<Props>> = ({ children, ...props }) => {
  const { corbadoApp, getProjectConfig, user } = useCorbado();
  const [flowHandler, setFlowHandler] = useState<FlowHandler>();
  const [currentScreen, setCurrentScreen] = useState<ScreenNames>(CommonScreens.Start);
  const [currentUserState, setCurrentUserState] = useState<UserState>({});
  const [currentFlow, setCurrentFlow] = useState<FlowNames>(
    props.initialFlowType === FlowType.Login
      ? LoginFlowNames.PasskeyLoginWithEmailOTPFallback
      : SignUpFlowNames.PasskeySignupWithEmailOTPFallback,
  );
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

      const flowHandler = new FlowHandler(projectConfig.val, props, i18n);

      onScreenChangeCbId.current = flowHandler.onScreenChange((value: ScreenNames) => setCurrentScreen(value));
      onFlowChangeCbId.current = flowHandler.onFlowChange((value: FlowNames) => setCurrentFlow(value));
      onUserStateChangeCbId.current = flowHandler.onUserStateChange((value: UserState) => {
        setCurrentUserState(value);
      });

      void flowHandler.init(corbadoApp);

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

    flowHandler?.updateUser(user);
  }, [initialized, user]);

  const navigateBack = useCallback(() => {
    return flowHandler?.navigateBack() ?? CommonScreens.Start;
  }, [flowHandler]);

  const changeFlow = useCallback(
    (flowType: FlowType) => {
      flowHandler?.changeFlow(flowType);
    },
    [flowHandler],
  );

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
      initialized,
      navigateBack,
      changeFlow,
      emitEvent,
    }),
    [currentFlow, currentScreen, currentUserState, initialized, navigateBack, changeFlow],
  );

  return <FlowHandlerContext.Provider value={contextValue}>{children}</FlowHandlerContext.Provider>;
};

export default FlowHandlerProvider;
