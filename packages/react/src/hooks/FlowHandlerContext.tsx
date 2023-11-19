import {createContext,} from "react";
import {FlowNames, FlowType, ScreenNames} from "@corbado/web-core";


export interface FlowHandlerContextInterface {
  currentFlow: FlowNames | undefined
  currentScreen: ScreenNames | undefined
  navigateNext: (event?: string) => Promise<void>
  navigateBack: () => void
  changeFlow: (flowType: FlowType) => void
}

const missingImplementation = (): never => {
  throw new Error('Please make sure that your components are wrapped inside <FlowHandlerProvider/>');
};

export const initialContext = {
  currentFlow: undefined,
  currentScreen: undefined,
  navigateNext: missingImplementation,
  navigateBack: missingImplementation,
  changeFlow: missingImplementation
};

const FlowHandlerContext = createContext<FlowHandlerContextInterface>(initialContext)

export default FlowHandlerContext
