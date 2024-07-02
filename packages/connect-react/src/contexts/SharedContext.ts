import type { CorbadoConnectConfig } from '@corbado/types';
import type { ConnectService } from '@corbado/web-core';
import { createContext } from 'react';

const missingImplementation = (): never => {
  throw new Error('Please make sure that your components are wrapped inside <SharedContext/>');
};

export interface SharedContextProps {
  getConnectService: () => ConnectService;
  setConnectService: (service: ConnectService) => void;
  sharedConfig: CorbadoConnectConfig;
}

export const initialContext: SharedContextProps = {
  getConnectService: missingImplementation,
  setConnectService: missingImplementation,
  sharedConfig: {} as CorbadoConnectConfig,
};

const SharedContext = createContext<SharedContextProps>(initialContext);

export default SharedContext;
