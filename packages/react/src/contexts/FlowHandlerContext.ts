import type { ScreenWithBlock } from '@corbado/shared-ui';
import { createContext } from 'react';

export interface FlowHandlerContextProps {
  currentScreen: ScreenWithBlock | undefined;
  initialized: boolean;
}

export const initialContext: FlowHandlerContextProps = {
  currentScreen: undefined,
  initialized: false,
};

const FlowHandlerContext = createContext<FlowHandlerContextProps>(initialContext);

export default FlowHandlerContext;
