import { useCorbado } from '@corbado/react-sdk';
import type { FlowHandlerEventOptions, FlowNames, FlowType, UserState } from '@corbado/shared-ui';
import { FlowHandlerEvents } from '@corbado/shared-ui';
import { FlowHandler, ScreenNames, SignUpFlowNames } from '@corbado/shared-ui';
import i18n from 'i18next';
import type { FC, PropsWithChildren } from 'react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { FlowHandlerContextProps } from './FlowHandlerContext';
import FlowHandlerContext from './FlowHandlerContext';

type Props = {
  onLoggedIn: () => void;
  onChangeFlow?: () => void;
  initialFlowType?: FlowType;
};

export const FlowHandlerProvider: FC<PropsWithChildren<Props>> = ({
  children,
  initialFlowType,
  onLoggedIn,
  onChangeFlow,
}) => {
  const { corbadoApp, getProjectConfig, user } = useCorbado();
  const [flowHandler, setFlowHandler] = useState<FlowHandler>();
  const [currentScreen, setCurrentScreen] = useState<ScreenNames>(ScreenNames.Start);
  const [currentUserState, setCurrentUserState] = useState<UserState>({});
  const [currentFlow, setCurrentFlow] = useState<FlowNames>(SignUpFlowNames.PasskeySignupWithEmailOTPFallback);
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
      const flowHandler = new FlowHandler(projectConfig.val, onLoggedIn, initialFlowType);

      onScreenChangeCbId.current = flowHandler.onScreenChange((value: ScreenNames) => setCurrentScreen(value));
      onFlowChangeCbId.current = flowHandler.onFlowChange((value: FlowNames) => {
        setCurrentFlow(value);
      });
      onUserStateChangeCbId.current = flowHandler.onUserStateChange((value: UserState) => {
        setCurrentUserState(value);
      });

      setCurrentFlow(flowHandler.currentFlowName);
      setCurrentScreen(flowHandler.currentScreenName);
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
    return flowHandler?.navigateBack() ?? ScreenNames.Start;
  }, [flowHandler]);

  const emitEvent = useCallback(
    (event?: FlowHandlerEvents, eventOptions?: FlowHandlerEventOptions) => {
      return flowHandler?.handleStateUpdate(event, eventOptions);
    },
    [flowHandler],
  );

  const changeFlow = useCallback(() => {
    if (onChangeFlow === undefined) {
      void emitEvent(FlowHandlerEvents.ChangeFlow);
    }

    onChangeFlow?.();
  }, [initialFlowType, onChangeFlow, emitEvent]);

  const contextValue = useMemo<FlowHandlerContextProps>(
    () => ({
      currentFlow,
      currentScreen,
      currentUserState,
      initialized,
      changeFlow,
      navigateBack,
      emitEvent,
    }),
    [currentFlow, currentScreen, currentUserState, initialized, navigateBack],
  );

  return <FlowHandlerContext.Provider value={contextValue}>{children}</FlowHandlerContext.Provider>;
};

export default FlowHandlerProvider;
