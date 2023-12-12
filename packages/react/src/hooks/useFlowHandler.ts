import { useContext } from 'react';

import type { FlowHandlerContextProps } from '../contexts/FlowHandlerContext';
import FlowHandlerContext from '../contexts/FlowHandlerContext';

const useFlowHandler = (context = FlowHandlerContext): FlowHandlerContextProps => {
  const flowHandler = useContext(context);

  if (!flowHandler) {
    throw new Error('Please make sure that your components are wrapped inside <FlowHandlerProvider />');
  }

  return flowHandler;
};

export default useFlowHandler;
