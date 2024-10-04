import type { CorbadoConnectConfig } from '@corbado/types';
import { ConnectService } from '@corbado/web-core';
import { FC, PropsWithChildren, useCallback } from 'react';
import React, { useEffect, useMemo, useState } from 'react';

import type { SharedContextProps } from './SharedContext';
import SharedContext from './SharedContext';

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
    [getConnectService, _setConnectService, config],
  );

  return <SharedContext.Provider value={contextValue}>{children}</SharedContext.Provider>;
};

export default SharedProvider;
