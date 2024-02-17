import { useCorbado } from '@corbado/react-sdk';
import type { FlowType, ScreenNames } from '@corbado/shared-ui';
import { FlowHandler } from '@corbado/shared-ui';
import type { Block } from '@corbado/shared-ui/dist/flowHandler/blocks/Block';
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
  const [currentScreen, setCurrentScreen] = useState<ScreenNames>();
  const [initialized, setInitialized] = useState(false);
  const onFlowChangeCbId = useRef<number>(0);
  const onUserStateChangeCbId = useRef<number>(0);
  const [block, setBlock] = useState<Block<unknown> | undefined>(undefined);

  useEffect(() => {
    const flowHandler = new FlowHandler(i18n, corbadoApp);

    onFlowChangeCbId.current = flowHandler.onScreenChange(value => {
      setCurrentScreen(value);
    });

    onUserStateChangeCbId.current = flowHandler.onBlockChange((value: Block<unknown>) => {
      setBlock(value);
    });

    void (async () => {
      await flowHandler.init(onLoggedIn);
      setInitialized(true);
    })();

    return () => {
      flowHandler.dispose();
      flowHandler.removeOnScreenChangeCallback(onFlowChangeCbId.current);
      flowHandler.removeOnBlockChange(onUserStateChangeCbId.current);
    };
  }, []);

  const contextValue = useMemo<FlowHandlerContextProps>(
    () => ({
      currentScreen,
      initialized,
      block,
    }),
    [currentScreen, initialized, block],
  );

  return <FlowHandlerContext.Provider value={contextValue}>{children}</FlowHandlerContext.Provider>;
};

export default FlowHandlerProvider;
