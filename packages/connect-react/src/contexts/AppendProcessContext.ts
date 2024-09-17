import type { CorbadoConnectAppendConfig } from '@corbado/types';
import { createContext } from 'react';

import { AppendScreenType } from '../types/screenTypes';
import type { AppendSituationCode } from '../types/situations';

const missingImplementation = (): never => {
  throw new Error('Please make sure that your components are wrapped inside <ProcessContext/>');
};

export interface AppendProcessContextProps {
  currentScreenType: AppendScreenType;
  currentScreenOptions: any;
  config: CorbadoConnectAppendConfig;
  navigateToScreen: (s: AppendScreenType, options?: any) => void;
  handleErrorSoft: (situation: AppendSituationCode) => Promise<void>;
  handleErrorHard: (situation: AppendSituationCode, explicit?: boolean) => Promise<void>;
  handleCredentialExistsError: () => Promise<void>;
  handleSkip: (situation: AppendSituationCode, explicit?: boolean) => Promise<void>;
}

export const initialContext: AppendProcessContextProps = {
  currentScreenType: AppendScreenType.Init,
  config: {} as CorbadoConnectAppendConfig,
  navigateToScreen: missingImplementation,
  currentScreenOptions: undefined,
  handleErrorSoft: missingImplementation,
  handleErrorHard: missingImplementation,
  handleCredentialExistsError: missingImplementation,
  handleSkip: missingImplementation,
};

const AppendProcessContext = createContext<AppendProcessContextProps>(initialContext);

export default AppendProcessContext;
