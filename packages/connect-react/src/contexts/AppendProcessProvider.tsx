import type { ConnectAppendError, CorbadoConnectAppendConfig } from '@corbado/types';
import log from 'loglevel';
import type { FC, PropsWithChildren } from 'react';
import React, { useCallback, useMemo, useState } from 'react';

import useShared from '../hooks/useShared';
import type { AppendScreenType } from '../types/screenTypes';
import type { AppendProcessContextProps } from './AppendProcessContext';
import AppendProcessContext from './AppendProcessContext';

type Props = {
  config: CorbadoConnectAppendConfig;
  initialScreenType: AppendScreenType;
};

export const AppendProcessProvider: FC<PropsWithChildren<Props>> = ({ children, initialScreenType, config }) => {
  const [currentScreenType, setCurrentScreenType] = useState<AppendScreenType>(initialScreenType);
  const [currentScreenOptions, setCurrentScreenOptions] = useState<any>();
  const { getConnectService } = useShared();

  const navigateToScreen = useCallback((screenType: AppendScreenType, options?: any) => {
    setCurrentScreenType(screenType);
    setCurrentScreenOptions(options);
  }, []);

  const handleErrorSoft = useCallback(
    async (typedError: ConnectAppendError, err?: Error) => {
      log.debug(`error (soft): ${typedError}`, err);

      await getConnectService().recordEventAppendError();

      config.onError?.(typedError);
    },
    [getConnectService, config],
  );

  const handleErrorHard = useCallback(
    async (typedError: ConnectAppendError, err?: Error, explicit?: boolean) => {
      log.debug(`error (hard): ${typedError}`, err);

      if (explicit) {
        await getConnectService().recordEventAppendExplicitAbort();
      } else {
        await getConnectService().recordEventAppendError();
      }

      config.onError?.(typedError);

      config.onSkip();
    },
    [getConnectService, config],
  );

  const handleSkip = useCallback(
    async (description: string, explicit?: boolean) => {
      log.debug(`skip: ${description}`);

      if (explicit) {
        await getConnectService().recordEventAppendExplicitAbort();
      }

      config.onSkip();
    },
    [getConnectService, config],
  );

  const handleCredentialExistsError = useCallback(async () => {
    log.debug('error (credential-exists)');

    await getConnectService().recordEventAppendCredentialExistsError();
    void config.onComplete();
  }, [getConnectService, config]);

  const contextValue = useMemo<AppendProcessContextProps>(
    () => ({
      currentScreenType,
      currentScreenOptions,
      navigateToScreen,
      config,
      handleErrorSoft,
      handleErrorHard,
      handleCredentialExistsError,
      handleSkip,
    }),
    [currentScreenType, navigateToScreen, config],
  );

  return <AppendProcessContext.Provider value={contextValue}>{children}</AppendProcessContext.Provider>;
};

export default AppendProcessProvider;
