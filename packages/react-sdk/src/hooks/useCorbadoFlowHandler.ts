import type { FlowNames, ScreenNames } from "@corbado/web-core";
import { CommonScreens, type StepFunctionParams } from "@corbado/web-core";
import { useContext, useEffect, useState } from "react";

import { AppContext } from "../contexts/CorbadoAppContext";

export const useCorbadoFlowHandler = () => {
  const flowHandlerService = useContext(AppContext)?.flowHandlerService;
  const [currentScreenName, setCurrentScreenName] = useState<ScreenNames>(
    CommonScreens.Start
  );
  const [currentFlowName, setCurrentFlowName] = useState<FlowNames | null>();

  if (flowHandlerService === undefined) {
    throw new Error(
      "useCorbadoFlowHandler must be used within an CorbadoProvider"
    );
  }

  useEffect(() => {
    if (!flowHandlerService) {
      return;
    }

    flowHandlerService.onFlowChange((flow) => {
      setCurrentFlowName(flow);
    });

    flowHandlerService?.onScreenChange((screen) => {
      setCurrentScreenName(screen);
    });
  }, [flowHandlerService]);

  const navigateToNextScreen = async (userInput: StepFunctionParams = {}) => {
    const nextScreen =
      // eslint-disable-next-line @typescript-eslint/await-thenable
      (await flowHandlerService?.navigateToNextScreen(userInput)) ??
      CommonScreens.End;
    setCurrentScreenName && setCurrentScreenName(nextScreen);
  };

  const navigateBack = () => {
    const prevScreen =
      flowHandlerService?.navigateBack() ?? CommonScreens.Start;
    setCurrentScreenName && setCurrentScreenName(prevScreen);
  };

  function changeFlow(flowName: FlowNames) {
    return flowHandlerService?.changeFlow(flowName);
  }

  return {
    currentFlowName,
    currentScreenName,
    navigateToNextScreen,
    navigateBack,
    changeFlow,
  };
};
