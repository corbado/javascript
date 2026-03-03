import { createContext } from 'react';

import type { ScreenWithBlock } from '../shared-ui';
import { InitState } from '../shared-ui';

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
