import type { ScreenWithBlock } from '@corbado/shared-ui';
import { InitState } from '@corbado/shared-ui';
import { createContext } from 'react';

export interface FlowHandlerContextProps {
  currentScreen: ScreenWithBlock | undefined;
  initState: InitState;
}

export const initialContext: FlowHandlerContextProps = {
  currentScreen: undefined,
  initState: InitState.Initializing,
};

const FlowHandlerContext = createContext<FlowHandlerContextProps>(initialContext);

export default FlowHandlerContext;
