import { useContext } from 'react';

import type { FlowHandlerContextInterface } from './FlowHandlerContext';
import FlowHandlerContext from './FlowHandlerContext';

const useFlowHandler = (context = FlowHandlerContext): FlowHandlerContextInterface =>
  useContext(context) ;

export default useFlowHandler;
