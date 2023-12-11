import type { FlowHandlerEventOptions, FlowHandlerEvents, FlowNames, FlowType, ScreenNames } from '@corbado/shared-ui';
import { CommonScreens, LoginFlowNames } from '@corbado/shared-ui';
import { createContext } from 'react';

export interface FlowHandlerContextProps {
  currentFlow: FlowNames;
  currentScreen: ScreenNames;
  navigateNext: (
    event?: FlowHandlerEvents,
    eventOptions?: FlowHandlerEventOptions,
  ) => Promise<ScreenNames> | ScreenNames;
  peekNext: (event?: FlowHandlerEvents, eventOptions?: FlowHandlerEventOptions) => Promise<ScreenNames> | ScreenNames;
  navigateBack: () => ScreenNames;
  changeFlow: (flowType: FlowType) => void;
}

export const initialContext: FlowHandlerContextProps = {
  currentFlow: LoginFlowNames.PasskeyLoginWithEmailOTPFallback,
  currentScreen: CommonScreens.Start,
  navigateNext: () => CommonScreens.End,
  peekNext: () => CommonScreens.End,
  navigateBack: () => CommonScreens.Start,
  changeFlow: () => void 0,
};

const FlowHandlerContext = createContext<FlowHandlerContextProps>(initialContext);

export default FlowHandlerContext;
