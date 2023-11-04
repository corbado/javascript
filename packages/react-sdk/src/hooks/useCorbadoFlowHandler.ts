// useFlowHandler.ts
import { useCallback, useState } from "react";

import { useAppContext } from "./useAppContext";

export const useFlowHandler = () => {
  const flowHandler = useAppContext().flowHandlerService;
  const [currentScreenName, setCurrentScreenName] = useState(
    flowHandler?.currentScreenName
  );

  const navigateToNextScreen = useCallback(
    (...userInputs) => {
      const nextScreen = flowHandler?.navigateToNextScreen(...userInputs);
      setCurrentScreenName(nextScreen);
    },
    [flowHandler]
  );

  const navigateBack = useCallback(() => {
    const prevScreen = flowHandler?.navigateBack();
    setCurrentScreenName(prevScreen);
  }, [flowHandler]);

  // Include other methods and properties as needed

  return {
    currentScreenName,
    navigateToNextScreen,
    navigateBack,
  };
};
