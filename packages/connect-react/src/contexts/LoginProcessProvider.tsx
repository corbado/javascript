import type { CorbadoConnectLoginConfig } from '@corbado/types';
import type { FC, PropsWithChildren } from 'react';
import React, { useCallback, useMemo, useState } from 'react';

import type { Flags } from '../types/flags';
import type { LoginScreenType } from '../types/screenTypes';
import type { LoginProcessContextProps } from './LoginProcessContext';
import LoginProcessContext from './LoginProcessContext';

type Props = {
  config: CorbadoConnectLoginConfig;
  initialScreenType: LoginScreenType;
};

export const LoginProcessProvider: FC<PropsWithChildren<Props>> = ({ children, initialScreenType, config }) => {
  const [currentScreenType, setCurrentScreenType] = useState<LoginScreenType>(initialScreenType);
  const [currentScreenOptions, setCurrentScreenOptions] = useState<any>();
  const [currentIdentifier, setCurrentIdentifier] = useState<string>('');
  const [flags, setFlags] = useState<Flags | undefined>();
  const [loadedMs] = useState<number>(() => Date.now());

  const navigateToScreen = useCallback((screenType: LoginScreenType, options?: any) => {
    setCurrentScreenType(screenType);
    setCurrentScreenOptions(options);
  }, []);

  const fallback = useCallback(
    (identifier: string, message: string | null) => {
      if (!message || !config.onFallbackSilent) {
        config.onFallback(identifier, message ?? '');
      } else {
        config.onFallbackSilent(identifier);
      }
    },
    [config],
  );

  const fallbackCustom = useCallback(
    (identifier: string, code: string, payload: string) => {
      if (!config.onFallbackCustom) {
        config.onFallback(identifier, code);
      } else {
        config.onFallbackCustom(identifier, code, payload);
      }
    },
    [config],
  );

  const contextValue = useMemo<LoginProcessContextProps>(
    () => ({
      currentScreenType,
      navigateToScreen,
      config,
      setCurrentIdentifier,
      currentIdentifier,
      flags,
      setFlags,
      currentScreenOptions,
      loadedMs,
      fallback,
      fallbackCustom,
    }),
    [currentScreenType, navigateToScreen, config, currentIdentifier, currentScreenOptions, flags],
  );

  return <LoginProcessContext.Provider value={contextValue}>{children}</LoginProcessContext.Provider>;
};

export default LoginProcessProvider;
