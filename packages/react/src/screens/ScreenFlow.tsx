import type { FlowNames } from "@corbado/react-sdk";
import { SignUpFlowNames, useCorbadoFlowHandler } from "@corbado/react-sdk";
import React from "react";

import { PasskeySignupWithEmailOtpFallbackFlow, SignupWithEmailOtpFlow } from "../flows";
import type { ScreensList } from "../types";

type FlowScreens = ScreensList;

type Flows = {
  [key in FlowNames]?: FlowScreens;
};

export const flows: Flows = {
    [SignUpFlowNames.EmailOTPSignup]: SignupWithEmailOtpFlow,
    [SignUpFlowNames.PasskeySignupWithEmailOTPFallback]: PasskeySignupWithEmailOtpFallbackFlow,
}

export const ScreensFlow = () => {
  const { currentFlowName, currentScreenName } = useCorbadoFlowHandler();

  if (!currentFlowName || !currentScreenName) {
    return null;
  }

  const Screen = flows[currentFlowName]?.[currentScreenName] as React.FC;
  return <Screen />;
};
