import { ConnectService } from '@corbado/web-core';
import { FC, PropsWithChildren, useEffect } from 'react';
import React, { useCallback, useMemo, useState } from 'react';
import SharedContext, { SharedContextProps } from './SharedContext';
import { CorbadoConnectConfig } from '@corbado/types';

type Props = {
  connectService?: ConnectService;
  config: CorbadoConnectConfig;
};

export const SharedProvider: FC<PropsWithChildren<Props>> = ({ children, connectService, config }) => {
  const [_connectService, _setConnectService] = useState(
    () =>
      connectService ??
      new ConnectService(
        config.projectId,
        config.frontendApiUrlSuffix ?? 'frontendapi.corbado.io',
        config.isDebug ?? false,
      ),
  );

  useEffect(() => {
    return () => {
      _connectService.dispose();
    };
  }, []);

  const getConnectService = useCallback(() => {
    return _connectService;
  }, [_connectService]);

  const contextValue = useMemo<SharedContextProps>(
    () => ({
      getConnectService,
      setConnectService: _setConnectService,
      sharedConfig: config,
    }),
    [getConnectService, _setConnectService],
  );

  return <SharedContext.Provider value={contextValue}>{children}</SharedContext.Provider>;
};

export default SharedProvider;
