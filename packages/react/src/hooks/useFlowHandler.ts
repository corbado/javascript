import {useContext} from "react";
import FlowHandlerContext, {FlowHandlerContextInterface} from "./FlowHandlerContext";

const useFlowHandler = (context = FlowHandlerContext): FlowHandlerContextInterface =>
  useContext(context) as FlowHandlerContextInterface

export default useFlowHandler;
