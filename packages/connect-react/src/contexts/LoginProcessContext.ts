import type { CorbadoConnectLoginConfig } from '@corbado/types';
import { createContext } from 'react';

import type { Flags } from '../types/flags';
import { LoginScreenType } from '../types/screenTypes';

const missingImplementation = (): never => {
  throw new Error('Please make sure that your components are wrapped inside <ProcessContext/>');
};

export interface LoginProcessContextProps {
  currentScreenType: LoginScreenType;
  currentScreenOptions: any;
  config: CorbadoConnectLoginConfig;
  navigateToScreen: (s: LoginScreenType, options?: any) => void;
  setCurrentIdentifier: (s: string) => void;
  currentIdentifier: string;
  flags: Flags | undefined;
  setFlags: (f: Flags) => void;
  loadedMs: number;
}

export const initialContext: LoginProcessContextProps = {
  currentScreenType: LoginScreenType.Loading,
  config: {} as CorbadoConnectLoginConfig,
  navigateToScreen: missingImplementation,
  setCurrentIdentifier: missingImplementation,
  currentIdentifier: '',
  currentScreenOptions: undefined,
  flags: undefined,
  setFlags: missingImplementation,
  loadedMs: 0,
};

const LoginProcessContext = createContext<LoginProcessContextProps>(initialContext);

export default LoginProcessContext;
