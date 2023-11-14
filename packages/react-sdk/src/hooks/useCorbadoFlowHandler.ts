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

  function checkFlowHandlerHealth() {
    if (flowHandlerService === undefined) {
      throw new Error(
        "useCorbadoFlowHandler must be used within an CorbadoProvider"
      );
    }
  }

  const navigateToNextScreen = async (userInput: StepFunctionParams = {}) => {
    checkFlowHandlerHealth();

    const nextScreen =
      // eslint-disable-next-line @typescript-eslint/await-thenable
      (await flowHandlerService?.navigateToNextScreen(userInput)) ??
      CommonScreens.End;
    setCurrentScreenName && setCurrentScreenName(nextScreen);
  };

  const navigateBack = () => {
    checkFlowHandlerHealth();

    const prevScreen =
      flowHandlerService?.navigateBack() ?? CommonScreens.Start;
    setCurrentScreenName && setCurrentScreenName(prevScreen);
  };

  function changeFlow(flowName: FlowNames) {
    checkFlowHandlerHealth();

    return flowHandlerService?.changeFlow(flowName);
  }

  checkFlowHandlerHealth();
  return {
    currentFlowName,
    currentScreenName,
    navigateToNextScreen,
    navigateBack,
    changeFlow,
  };
};
