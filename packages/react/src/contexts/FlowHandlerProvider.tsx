import type { AuthType, ScreenWithBlock } from '@corbado/shared-ui';
import { InitState, ProcessHandler } from '@corbado/shared-ui';
import i18n from 'i18next';
import type { FC, PropsWithChildren } from 'react';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import { useCorbado } from '../hooks/useCorbado';
import type { FlowHandlerContextProps } from './FlowHandlerContext';
import FlowHandlerContext from './FlowHandlerContext';

type Props = {
  onLoggedIn: () => void;
  onChangeFlow?: () => void;
  initialFlowType?: AuthType;
};

export const FlowHandlerProvider: FC<PropsWithChildren<Props>> = ({ children, onLoggedIn }) => {
  const { corbadoApp, skipHashedUrls } = useCorbado();
  const [currentScreen, setCurrentScreen] = useState<ScreenWithBlock>();
  const [initState, setInitState] = useState<InitState>(InitState.Initializing);
  const onFlowChangeCbId = useRef<number>(0);

  useEffect(() => {
    const flowHandler = new ProcessHandler(i18n, corbadoApp, onLoggedIn, skipHashedUrls);

    onFlowChangeCbId.current = flowHandler.onScreenChange(value => {
      setCurrentScreen(value);
    });

    void (async () => {
      const res = await flowHandler.init();
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
