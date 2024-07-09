import type { CorbadoConnectPasskeyListConfig } from '@corbado/types';
import { createContext } from 'react';

import { ManageScreenType } from '../types/screenTypes';

const missingImplementation = (): never => {
  throw new Error('Please make sure that your components are wrapped inside <ProcessContext/>');
};

export interface ManageProcessContextProps {
  currentScreenType: ManageScreenType;
  config: CorbadoConnectPasskeyListConfig;
  navigateToScreen: (s: ManageScreenType) => void;
}

export const initialContext: ManageProcessContextProps = {
  currentScreenType: ManageScreenType.Init,
  config: {} as CorbadoConnectPasskeyListConfig,
  navigateToScreen: missingImplementation,
};

const ManageProcessContext = createContext<ManageProcessContextProps>(initialContext);

export default ManageProcessContext;