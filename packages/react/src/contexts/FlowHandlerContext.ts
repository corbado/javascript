import type {
  FlowHandlerEventOptions,
  FlowHandlerEvents,
  FlowNames,
  FlowType,
  ScreenNames,
  UserState,
} from '@corbado/shared-ui';
import { CommonScreens, LoginFlowNames } from '@corbado/shared-ui';
import { createContext } from 'react';

export interface FlowHandlerContextProps {
  currentFlow: FlowNames;
  currentScreen: ScreenNames;
  currentUserState: UserState;
  initialized: boolean;
  navigateBack: () => ScreenNames;
  changeFlow: (flowType: FlowType) => void;
  emitEvent: (event?: FlowHandlerEvents, eventOptions?: FlowHandlerEventOptions) => Promise<void> | undefined;
}

export const initialContext: FlowHandlerContextProps = {
  currentFlow: LoginFlowNames.PasskeyLoginWithEmailOTPFallback,
  currentScreen: CommonScreens.Start,
  currentUserState: {},
  initialized: false,
  navigateBack: () => CommonScreens.Start,
  changeFlow: () => void 0,
  emitEvent: () => Promise.reject(),
};

const FlowHandlerContext = createContext<FlowHandlerContextProps>(initialContext);

export default FlowHandlerContext;
