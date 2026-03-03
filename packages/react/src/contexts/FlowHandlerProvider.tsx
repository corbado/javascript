import i18n from 'i18next';
import type { FC, PropsWithChildren } from 'react';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';

import { useCorbado } from '../hooks/useCorbado';
import { useTelemetry } from '../hooks/useTelemetry';
import type { AuthType, BlockTypes, ScreenWithBlock } from '../shared-ui';
import { InitState, ProcessHandler } from '../shared-ui';
import type { FlowHandlerContextProps } from './FlowHandlerContext';
import FlowHandlerContext from './FlowHandlerContext';
import { ObserveContext } from './ObserveContext';

type Props = {
  initialBlock?: BlockTypes;
  onLoggedIn: () => void;
  onChangeFlow?: () => void;
  initialFlowType?: AuthType;
  handleNavigationEvents?: boolean;
};

export const FlowHandlerProvider: FC<PropsWithChildren<Props>> = ({
  children,
  handleNavigationEvents,
  onLoggedIn,
  initialBlock,
}) => {
  const { corbadoApp } = useCorbado();
  const { tracker } = useContext(ObserveContext);
  const [currentScreen, setCurrentScreen] = useState<ScreenWithBlock>();
  const [initState, setInitState] = useState<InitState>(InitState.Initializing);
  const { disableTelemetry, logComponentMounted } = useTelemetry();
  const onFlowChangeCbId = useRef<number>(0);

  useEffect(() => {
    const flowHandler = new ProcessHandler(i18n, corbadoApp, onLoggedIn, handleNavigationEvents, tracker);

    onFlowChangeCbId.current = flowHandler.onScreenChange(value => {
      if (onFlowChangeCbId.current === 0) {
        if (value.block.common.environment !== 'dev') {
          disableTelemetry();
        } else {
          logComponentMounted();
        }
      }
      setCurrentScreen(value);
    });

    void (async () => {
      const res = await flowHandler.init(initialBlock);
      if (res.ok) {
        setInitState(InitState.Success);
      } else if (!res.val.ignore) {
        setInitState(InitState.Failed);
      }
    })();

    return () => {
      flowHandler.dispose();
      flowHandler.removeOnScreenChangeCallback(onFlowChangeCbId.current);
    };
  }, []);

  const contextValue = useMemo<FlowHandlerContextProps>(
    () => ({
      currentScreen,
      initState,
    }),
    [currentScreen, initState],
  );

  return <FlowHandlerContext.Provider value={contextValue}>{children}</FlowHandlerContext.Provider>;
};

export default FlowHandlerProvider;
