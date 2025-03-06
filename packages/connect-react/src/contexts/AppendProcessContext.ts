import type { CorbadoConnectAppendConfig } from '@corbado/types';
import { createContext } from 'react';

import type { Flags } from '../types/flags';
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
  handleErrorSoft: (situation: AppendSituationCode, expected: boolean, showError: boolean) => Promise<void>;
  handleErrorHard: (situation: AppendSituationCode, expected: boolean) => Promise<void>;
  handleCredentialExistsError: () => Promise<void>;
  handleSkip: (situation: AppendSituationCode, explicit?: boolean) => Promise<void>;
  onReadMoreClick: () => Promise<void>;
  flags: Flags | undefined;
  setFlags: (f: Flags) => void;
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
  onReadMoreClick: missingImplementation,
  flags: undefined,
  setFlags: missingImplementation,
};

const AppendProcessContext = createContext<AppendProcessContextProps>(initialContext);

export default AppendProcessContext;
