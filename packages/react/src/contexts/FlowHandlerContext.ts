import type { FlowHandlerEventOptions, FlowHandlerEvents, FlowNames, UserState } from '@corbado/shared-ui';
import { LoginFlowNames, ScreenNames } from '@corbado/shared-ui';
import type { FlowTypes, VerificationMethods } from '@corbado/types';
import { createContext } from 'react';

export interface FlowHandlerContextProps {
  currentFlowType: FlowTypes;
  currentFlow: FlowNames;
  currentScreen: ScreenNames;
  currentUserState: UserState;
  currentVerificationMethod: VerificationMethods;
  initialized: boolean;
  navigateBack: () => ScreenNames;
  emitEvent: (event?: FlowHandlerEvents, eventOptions?: FlowHandlerEventOptions) => Promise<void> | undefined;
  changeFlow: () => void;
}

export const initialContext: FlowHandlerContextProps = {
  currentFlowType: 'signup',
  currentFlow: LoginFlowNames.PasskeyLoginWithEmailOTPFallback,
  currentScreen: ScreenNames.Start,
  currentUserState: {},
  currentVerificationMethod: 'emailOtp',
  initialized: false,
  navigateBack: () => ScreenNames.Start,
  emitEvent: () => Promise.reject(),
  changeFlow: () => void 0,
};

const FlowHandlerContext = createContext<FlowHandlerContextProps>(initialContext);

export default FlowHandlerContext;
