import type { CorbadoConnectAppendConfig } from '@corbado/types';
import { createContext } from 'react';

import { AppendScreenType } from '../types/screenTypes';

const missingImplementation = (): never => {
  throw new Error('Please make sure that your components are wrapped inside <ProcessContext/>');
};

export interface AppendProcessContextProps {
  currentScreenType: AppendScreenType;
  currentScreenOptions: any;
  config: CorbadoConnectAppendConfig;
  navigateToScreen: (s: AppendScreenType, options?: any) => void;
}

export const initialContext: AppendProcessContextProps = {
  currentScreenType: AppendScreenType.Init,
  config: {} as CorbadoConnectAppendConfig,
  navigateToScreen: missingImplementation,
  currentScreenOptions: undefined,
};

const AppendProcessContext = createContext<AppendProcessContextProps>(initialContext);

export default AppendProcessContext;
