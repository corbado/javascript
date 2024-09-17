import type { CorbadoConnectAppendConfig } from '@corbado/types';
import log from 'loglevel';
import type { FC, PropsWithChildren } from 'react';
import React, { useCallback, useMemo, useState } from 'react';

import useShared from '../hooks/useShared';
import type { AppendScreenType } from '../types/screenTypes';
import type { AppendProcessContextProps } from './AppendProcessContext';
import AppendProcessContext from './AppendProcessContext';
import { AppendSituationCode } from '../types/situations';

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
    async (situationCode: AppendSituationCode) => {
      await getConnectService().recordEventAppendError();
      config.onError?.(situationCode.toString());
    },
    [getConnectService, config],
  );

  const handleErrorHard = useCallback(
    async (situationCode: AppendSituationCode, explicit?: boolean) => {
      if (explicit) {
        await getConnectService().recordEventAppendExplicitAbort();
      } else {
        await getConnectService().recordEventAppendError();
      }

      config.onError?.(situationCode.toString());
      config.onSkip();
    },
    [getConnectService, config],
  );

  const handleSkip = useCallback(
    async (_: AppendSituationCode, explicit?: boolean) => {
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
