import type { CorbadoConnectAppendConfig } from '@corbado/types';
import type { ConnectService } from '@corbado/web-core';
import { createContext } from 'react';

import { AppendScreenType } from '../types/screenTypes';

const missingImplementation = (): never => {
  throw new Error('Please make sure that your components are wrapped inside <ProcessContext/>');
};

export interface AppendProcessContextProps {
  currentScreenType: AppendScreenType;
  getConnectService: () => ConnectService;
  config: CorbadoConnectAppendConfig;
  navigateToScreen: (s: AppendScreenType) => void;
}

export const initialContext: AppendProcessContextProps = {
  currentScreenType: AppendScreenType.Init,
  config: {} as CorbadoConnectAppendConfig,
  getConnectService: missingImplementation,
  navigateToScreen: missingImplementation,
};

const AppendProcessContext = createContext<AppendProcessContextProps>(initialContext);

export default AppendProcessContext;
