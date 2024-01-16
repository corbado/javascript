import type { FlowHandlerEventOptions, FlowHandlerEvents, FlowNames, UserState } from '@corbado/shared-ui';
import { LoginFlowNames, ScreenNames } from '@corbado/shared-ui';
import { createContext } from 'react';

export interface FlowHandlerContextProps {
  currentFlow: FlowNames;
  currentScreen: ScreenNames;
  currentUserState: UserState;
  initialized: boolean;
  navigateBack: () => ScreenNames;
  emitEvent: (event?: FlowHandlerEvents, eventOptions?: FlowHandlerEventOptions) => Promise<void> | undefined;
  changeFlow: () => void;
}

export const initialContext: FlowHandlerContextProps = {
  currentFlow: LoginFlowNames.PasskeyLoginWithEmailOTPFallback,
  currentScreen: ScreenNames.Start,
  currentUserState: {},
  initialized: false,
  navigateBack: () => ScreenNames.Start,
  emitEvent: () => Promise.reject(),
  changeFlow: () => void 0,
};

const FlowHandlerContext = createContext<FlowHandlerContextProps>(initialContext);

export default FlowHandlerContext;
