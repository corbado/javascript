import type {
  FlowHandlerEventOptionsInterface,
  FlowHandlerEvents,
  FlowNames,
  FlowType,
  ScreenNames,
} from '@corbado/web-core';
import { CommonScreens, LoginFlowNames } from '@corbado/web-core';
import { createContext } from 'react';

export interface FlowHandlerContextInterface {
  currentFlow: FlowNames;
  currentScreen: ScreenNames;
  navigateNext: (
    event?: FlowHandlerEvents,
    eventOptions?: FlowHandlerEventOptionsInterface,
  ) => Promise<ScreenNames> | ScreenNames;
  peekNext: (
    event?: FlowHandlerEvents,
    eventOptions?: FlowHandlerEventOptionsInterface,
  ) => Promise<ScreenNames> | ScreenNames;
  navigateBack: () => ScreenNames;
  changeFlow: (flowType: FlowType) => void;
}

export const initialContext: FlowHandlerContextInterface = {
  currentFlow: LoginFlowNames.PasskeyLoginWithEmailOTPFallback,
  currentScreen: CommonScreens.Start,
  navigateNext: () => CommonScreens.End,
  peekNext: () => CommonScreens.End,
  navigateBack: () => CommonScreens.Start,
  changeFlow: () => void 0,
};

const FlowHandlerContext = createContext<FlowHandlerContextInterface>(initialContext);

export default FlowHandlerContext;
