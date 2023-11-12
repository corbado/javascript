import type { FlowNames } from "@corbado/react-sdk";
import { SignUpFlowNames, useCorbadoFlowHandler } from "@corbado/react-sdk";
import React from "react";

import { SignupWithEmailOtpFlow } from "../flows";
import type { SignupWithEmailOTPScreens } from "../types";

type FlowScreens = SignupWithEmailOTPScreens; // Append other flow screens to this type.

type Flows = {
  [key in FlowNames]?: FlowScreens;
};

export const flows: Flows = {
  [SignUpFlowNames.EmailOTPSignup]: SignupWithEmailOtpFlow,
};

export const ScreensFlow = () => {
  const { currentFlowName, currentScreenName } = useCorbadoFlowHandler();

  if (!currentFlowName || !currentScreenName) {
    return null;
  }

  const Screen = flows[currentFlowName]?.[currentScreenName] as React.FC;
  return <Screen />;
};
