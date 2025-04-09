import type { AppendStatus, CorbadoConnectAppendConfig } from '@corbado/types';
import log from 'loglevel';
import type { FC, PropsWithChildren } from 'react';
import React, { useCallback, useMemo, useState } from 'react';

import useShared from '../hooks/useShared';
import type { Flags } from '../types/flags';
import type { AppendScreenType } from '../types/screenTypes';
import type { AppendSituationCode } from '../types/situations';
import type { AppendProcessContextProps } from './AppendProcessContext';
import AppendProcessContext from './AppendProcessContext';
import type { ConnectError } from '@corbado/web-core';

type Props = {
  config: CorbadoConnectAppendConfig;
  initialScreenType: AppendScreenType;
};

export const AppendProcessProvider: FC<PropsWithChildren<Props>> = ({ children, initialScreenType, config }) => {
  const [currentScreenType, setCurrentScreenType] = useState<AppendScreenType>(initialScreenType);
  const [currentScreenOptions, setCurrentScreenOptions] = useState<any>();
  const { getConnectService } = useShared();
  const [flags, setFlags] = useState<Flags | undefined>();

  const navigateToScreen = useCallback((screenType: AppendScreenType, options?: any) => {
    setCurrentScreenType(screenType);
    setCurrentScreenOptions(options);
  }, []);

  const handleErrorSoft = useCallback(
    async (situationCode: AppendSituationCode, expected: boolean, showError: boolean, error?: ConnectError) => {
      if (expected) {
        await getConnectService().recordEventAppendError();
      } else {
        await getConnectService().recordEventAppendErrorUnexpected(`situation: ${situationCode} ${error?.track()}`);
      }

      if (showError) {
        config.onError?.(situationCode.toString());
      }
    },
    [getConnectService, config],
  );

  const handleErrorHard = useCallback(
    async (situationCode: AppendSituationCode, expected: boolean, error?: ConnectError) => {
      if (expected) {
        await getConnectService().recordEventAppendError();
      } else {
        await getConnectService().recordEventAppendErrorUnexpected(`situation: ${situationCode} ${error?.track()}`);
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

  const handleCredentialExistsError = useCallback(
    async (error?: ConnectError) => {
      log.debug('error (credential-exists)');

      await getConnectService().recordEventAppendCredentialExistsError(error?.track() ?? '');
      void config.onComplete('complete-noop', getConnectService().encodeClientState());
    },
    [getConnectService, config],
  );

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
      flags,
      setFlags,
    }),
    [currentScreenType, navigateToScreen, config, flags],
  );

  return <AppendProcessContext.Provider value={contextValue}>{children}</AppendProcessContext.Provider>;
};

export default AppendProcessProvider;
