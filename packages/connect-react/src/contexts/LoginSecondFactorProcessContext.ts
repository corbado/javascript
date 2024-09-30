import type { CorbadoConnectLoginSecondFactorConfig } from '@corbado/types';
import { createContext } from 'react';

import type { Flags } from '../types/flags';
import { LoginSecondFactorScreenType } from '../types/screenTypes';

const missingImplementation = (): never => {
  throw new Error('Please make sure that your components are wrapped inside <LoginSecondFactorProcessContext/>');
};

export interface LoginSecondFactorProcessContextProps {
  currentScreenType: LoginSecondFactorScreenType;
  currentScreenOptions: any;
  config: CorbadoConnectLoginSecondFactorConfig;
  navigateToScreen: (s: LoginSecondFactorScreenType, options?: any) => void;
  flags: Flags | undefined;
  setFlags: (f: Flags) => void;
  loadedMs: number;
}

export const initialContext: LoginSecondFactorProcessContextProps = {
  currentScreenType: LoginSecondFactorScreenType.Loading,
  config: {} as CorbadoConnectLoginSecondFactorConfig,
  navigateToScreen: missingImplementation,
  currentScreenOptions: undefined,
  flags: undefined,
  setFlags: missingImplementation,
  loadedMs: 0,
};

const LoginSecondFactorProcessContext = createContext<LoginSecondFactorProcessContextProps>(initialContext);

export default LoginSecondFactorProcessContext;
