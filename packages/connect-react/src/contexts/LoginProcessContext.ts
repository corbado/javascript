import type { CorbadoConnectLoginConfig } from '@corbado/types';
import type { ConnectService } from '@corbado/web-core';
import { createContext } from 'react';

import { LoginScreenType } from '../types/ScreenType';

const missingImplementation = (): never => {
  throw new Error('Please make sure that your components are wrapped inside <ProcessContext/>');
};

export interface LoginProcessContextProps {
  currentScreenType: LoginScreenType;
  getConnectService: () => ConnectService;
  config: CorbadoConnectLoginConfig;
  navigateToScreen: (s: LoginScreenType) => void;
  setCurrentIdentifier: (s: string) => void;
  currentIdentifier: string;
}

export const initialContext: LoginProcessContextProps = {
  currentScreenType: LoginScreenType.Loading,
  config: {} as CorbadoConnectLoginConfig,
  getConnectService: missingImplementation,
  navigateToScreen: missingImplementation,
  setCurrentIdentifier: missingImplementation,
  currentIdentifier: '',
};

const LoginProcessContext = createContext<LoginProcessContextProps>(initialContext);

export default LoginProcessContext;
