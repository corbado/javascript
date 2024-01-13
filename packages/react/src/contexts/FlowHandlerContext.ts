import type { FlowHandlerEventOptions, FlowHandlerEvents, FlowNames, ScreenNames, UserState } from '@corbado/shared-ui';
import { CommonScreens, LoginFlowNames } from '@corbado/shared-ui';
import type { FlowStyles } from '@corbado/types';
import { createContext } from 'react';

export interface FlowHandlerContextProps {
  currentFlow: FlowNames;
  currentScreen: ScreenNames;
  currentUserState: UserState;
  currentFlowStyle: FlowStyles;
  initialized: boolean;
  navigateBack: () => ScreenNames;
  emitEvent: (event?: FlowHandlerEvents, eventOptions?: FlowHandlerEventOptions) => Promise<void> | undefined;
  changeFlow: () => void;
}

export const initialContext: FlowHandlerContextProps = {
  currentFlow: LoginFlowNames.PasskeyLoginWithEmailOTPFallback,
  currentScreen: CommonScreens.Start,
  currentFlowStyle: 'PasskeyWithEmailOTPFallback',
  currentUserState: {},
  initialized: false,
  navigateBack: () => CommonScreens.Start,
  emitEvent: () => Promise.reject(),
  changeFlow: () => void 0,
};

const FlowHandlerContext = createContext<FlowHandlerContextProps>(initialContext);

export default FlowHandlerContext;
