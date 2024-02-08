import { useCorbado } from '@corbado/react-sdk';
import type {
  FlowHandlerEventOptions,
  FlowNames,
  FlowType,
  FlowTypeText,
  UserState,
  VerificationMethods,
} from '@corbado/shared-ui';
import { FlowHandler, FlowHandlerEvents, ScreenNames } from '@corbado/shared-ui';
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
  const { corbadoApp, getProjectConfig } = useCorbado();
  const [flowHandler, setFlowHandler] = useState<FlowHandler>();
  const [currentScreen, setCurrentScreen] = useState<ScreenNames>();
  const [currentUserState, setCurrentUserState] = useState<UserState>({});
  const [currentFlow, setCurrentFlow] = useState<FlowNames>();
  const [initialized, setInitialized] = useState(false);
  const [userNameRequired, setUserNameRequired] = useState(true);
  const [allowUserRegistration, setAllowUserRegistration] = useState(true);
  const currentFlowType = useRef<FlowTypeText>();
  const verificationMethod = useRef<VerificationMethods>();
  const onFlowChangeCbId = useRef<number>(0);
  const onUserStateChangeCbId = useRef<number>(0);

  useEffect(() => {
    const flowHandler = new FlowHandler(corbadoApp);
    void (async () => {
      if (initialized) {
        return;
      }

      const projectConfigResult = await getProjectConfig();
      if (projectConfigResult.err) {
        // currently there are no errors that can be thrown here
        return;
      }

      onFlowChangeCbId.current = flowHandler.onFlowChange(updates => {
        updates.flowName && setCurrentFlow(updates.flowName);
        updates.screenName && setCurrentScreen(updates.screenName);

        if (updates.flowType) {
          currentFlowType.current = updates.flowType;
        }

        if (updates.verificationMethod) {
          verificationMethod.current = updates.verificationMethod;
        }
      });

      onUserStateChangeCbId.current = flowHandler.onUserStateChange((value: UserState) => {
        setCurrentUserState(value);
      });

      const projectConfig = projectConfigResult.val;
      await flowHandler.init(i18n, projectConfig, onLoggedIn, initialFlowType);

      setFlowHandler(flowHandler);
      setUserNameRequired(flowHandler.userNameRequired);
      setAllowUserRegistration(flowHandler.allowUserRegistration);
      setInitialized(true);
    })();

    return () => {
      flowHandler.dispose();
      flowHandler.removeOnFlowChangeCallback(onFlowChangeCbId.current);
      flowHandler.removeOnUserStateChange(onUserStateChangeCbId.current);
    };
  }, []);

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
      currentFlowType: currentFlowType.current,
      currentFlow,
      currentScreen,
      currentUserState,
      currentVerificationMethod: verificationMethod.current,
      initialized,
      userNameRequired,
      allowUserRegistration,
      changeFlow,
      navigateBack,
      emitEvent,
    }),
    [
      currentFlowType.current,
      verificationMethod.current,
      currentFlow,
      currentScreen,
      currentUserState,
      initialized,
      navigateBack,
    ],
  );

  return <FlowHandlerContext.Provider value={contextValue}>{children}</FlowHandlerContext.Provider>;
};

export default FlowHandlerProvider;
