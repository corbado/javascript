import { useCorbado } from '@corbado/react-sdk';
import type { FlowType, ScreenWithBlock } from '@corbado/shared-ui';
import { FlowHandler } from '@corbado/shared-ui';
import i18n from 'i18next';
import type { FC, PropsWithChildren } from 'react';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import type { FlowHandlerContextProps } from './FlowHandlerContext';
import FlowHandlerContext from './FlowHandlerContext';

type Props = {
  onLoggedIn: () => void;
  onChangeFlow?: () => void;
  initialFlowType?: FlowType;
};

export const FlowHandlerProvider: FC<PropsWithChildren<Props>> = ({ children, onLoggedIn }) => {
  const { corbadoApp } = useCorbado();
  const [currentScreen, setCurrentScreen] = useState<ScreenWithBlock>();
  const [initialized, setInitialized] = useState(false);
  const onFlowChangeCbId = useRef<number>(0);

  useEffect(() => {
    const flowHandler = new FlowHandler(i18n, corbadoApp);

    onFlowChangeCbId.current = flowHandler.onScreenChange(value => {
      setCurrentScreen(value);
    });

    void (async () => {
      await flowHandler.init(onLoggedIn);
      setInitialized(true);
    })();

    return () => {
      flowHandler.dispose();
      flowHandler.removeOnScreenChangeCallback(onFlowChangeCbId.current);
    };
  }, []);

  const contextValue = useMemo<FlowHandlerContextProps>(
    () => ({
      currentScreen,
      initialized,
    }),
    [currentScreen, initialized],
  );

  return <FlowHandlerContext.Provider value={contextValue}>{children}</FlowHandlerContext.Provider>;
};

export default FlowHandlerProvider;
