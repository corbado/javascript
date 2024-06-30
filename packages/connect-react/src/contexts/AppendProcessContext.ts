import type { CorbadoConnectAppendConfig } from '@corbado/types';
import { createContext } from 'react';

import { AppendScreenType } from '../types/screenTypes';

const missingImplementation = (): never => {
  throw new Error('Please make sure that your components are wrapped inside <ProcessContext/>');
};

export interface AppendProcessContextProps {
  currentScreenType: AppendScreenType;
  config: CorbadoConnectAppendConfig;
  navigateToScreen: (s: AppendScreenType) => void;
}

export const initialContext: AppendProcessContextProps = {
  currentScreenType: AppendScreenType.Init,
  config: {} as CorbadoConnectAppendConfig,
  navigateToScreen: missingImplementation,
};

const AppendProcessContext = createContext<AppendProcessContextProps>(initialContext);

export default AppendProcessContext;
