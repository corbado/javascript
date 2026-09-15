import type { CorbadoConnectPasskeyListConfig } from '@corbado/types';
import type { RefObject } from 'react';
import { createContext } from 'react';

import { ManageScreenType } from '../types/screenTypes';

const missingImplementation = (): never => {
  throw new Error('Please make sure that your components are wrapped inside <ProcessContext/>');
};

export interface ManageProcessContextProps {
  currentScreenType: ManageScreenType;
  passkeyListToken: string;
  config: CorbadoConnectPasskeyListConfig;
  /** Element the component is mounted in; DOM events for the host page are dispatched on it. */
  containerRef?: RefObject<HTMLElement>;
  navigateToScreen: (s: ManageScreenType) => void;
  setPasskeyListToken: (t: string) => void;
}

export const initialContext: ManageProcessContextProps = {
  currentScreenType: ManageScreenType.Init,
  passkeyListToken: '',
  config: {} as CorbadoConnectPasskeyListConfig,
  navigateToScreen: missingImplementation,
  setPasskeyListToken: missingImplementation,
};

const ManageProcessContext = createContext<ManageProcessContextProps>(initialContext);

export default ManageProcessContext;
