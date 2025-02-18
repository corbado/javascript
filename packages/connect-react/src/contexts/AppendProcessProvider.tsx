import type { AppendStatus, CorbadoConnectAppendConfig } from '@corbado/types';
import log from 'loglevel';
import type { FC, PropsWithChildren } from 'react';
import React, { useCallback, useMemo, useState } from 'react';

import useShared from '../hooks/useShared';
import type { AppendScreenType } from '../types/screenTypes';
import type { AppendSituationCode } from '../types/situations';
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
    async (situationCode: AppendSituationCode, expected: boolean) => {
      if (expected) {
        await getConnectService().recordEventAppendError();
      } else {
        await getConnectService().recordEventAppendErrorUnexpected(`situation: ${situationCode}`);
      }

      config.onError?.(situationCode.toString());
    },
    [getConnectService, config],
  );

  const handleErrorHard = useCallback(
    async (situationCode: AppendSituationCode, expected: boolean) => {
      if (expected) {
        await getConnectService().recordEventAppendError();
      } else {
        await getConnectService().recordEventAppendErrorUnexpected(`situation: ${situationCode}`);
      }

      config.onError?.(situationCode.toString());
      void config.onSkip('skip-implicit');
    },
    [getConnectService, config],
  );

  const handleSkip = useCallback(
    async (_: AppendSituationCode, explicit?: boolean) => {
      let status: AppendStatus = 'skip-implicit';
      if (explicit) {
        status = 'skip-explicit';
        await getConnectService().recordEventAppendExplicitAbort();
      }

      void config.onSkip(status);
    },
    [getConnectService, config],
  );

  const onReadMoreClick = useCallback(async () => {
    await getConnectService().recordEventAppendLearnMore();
  }, [getConnectService, config]);

  const handleCredentialExistsError = useCallback(async () => {
    log.debug('error (credential-exists)');

    await getConnectService().recordEventAppendCredentialExistsError();
    void config.onComplete('complete-noop');
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
      onReadMoreClick,
    }),
    [currentScreenType, navigateToScreen, config],
  );

  return <AppendProcessContext.Provider value={contextValue}>{children}</AppendProcessContext.Provider>;
};

export default AppendProcessProvider;
