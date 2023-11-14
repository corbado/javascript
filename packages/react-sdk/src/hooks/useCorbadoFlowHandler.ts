import { CommonScreens, type StepFunctionParams } from "@corbado/web-core";
import { useContext } from "react";

import { AppContext } from "../contexts/CorbadoAppContext";

export const useCorbadoFlowHandler = () => {
  const appContext = useContext(AppContext);
  const {
    flowHandlerService,
    currentFlowName,
    currentScreenName,
    setCurrentScreenName,
  } = appContext ?? {};

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

  checkFlowHandlerHealth();
  return {
    currentFlowName,
    currentScreenName,
    navigateToNextScreen,
    navigateBack,
  };
};
