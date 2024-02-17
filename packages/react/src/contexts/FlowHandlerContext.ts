import type { ScreenNames } from '@corbado/shared-ui';
import type { Block } from '@corbado/shared-ui/dist/flowHandler/blocks/Block';
import { createContext } from 'react';

export interface FlowHandlerContextProps {
  currentScreen: ScreenNames | undefined;
  initialized: boolean;
  block: Block<unknown> | undefined;
}

export const initialContext: FlowHandlerContextProps = {
  currentScreen: undefined,
  initialized: false,
  block: undefined,
};

const FlowHandlerContext = createContext<FlowHandlerContextProps>(initialContext);

export default FlowHandlerContext;
