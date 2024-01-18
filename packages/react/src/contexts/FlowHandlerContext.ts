import type { FlowHandlerEventOptions, FlowHandlerEvents, FlowNames, UserState } from '@corbado/shared-ui';
import { ScreenNames } from '@corbado/shared-ui';
import type { FlowTypes, VerificationMethods } from '@corbado/types';
import { createContext } from 'react';

export interface FlowHandlerContextProps {
  currentFlowType: FlowTypes | undefined;
  currentFlow: FlowNames | undefined;
  currentScreen: ScreenNames | undefined;
  currentUserState: UserState;
  currentVerificationMethod: VerificationMethods | undefined;
  initialized: boolean;
  navigateBack: () => ScreenNames;
  emitEvent: (event?: FlowHandlerEvents, eventOptions?: FlowHandlerEventOptions) => Promise<void> | undefined;
  changeFlow: () => void;
}

export const initialContext: FlowHandlerContextProps = {
  currentFlowType: undefined,
  currentFlow: undefined,
  currentScreen: undefined,
  currentUserState: {},
  currentVerificationMethod: undefined,
  initialized: false,
  navigateBack: () => ScreenNames.Start,
  emitEvent: () => Promise.reject(),
  changeFlow: () => void 0,
};

const FlowHandlerContext = createContext<FlowHandlerContextProps>(initialContext);

export default FlowHandlerContext;
