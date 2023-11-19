import type {FlowNames} from "@corbado/react-sdk";
import {LoginFlowNames, SignUpFlowNames} from "@corbado/react-sdk";
import React from "react";

import {
  EmailOTPSignupFlow,
  PasskeySignupWithEmailOTPFallbackFlow,
  PasskeyLoginWithEmailOTPFallbackFlow
} from "../flows";
import type {SignupWithEmailOTPScreens} from "../types";
import useFlowHandler from "../hooks/useFlowHandler";

type FlowScreens = SignupWithEmailOTPScreens; // Append other flow screens to this type.

type Flows = {
  [key in FlowNames]?: FlowScreens;
};

export const flows: Flows = {
  [SignUpFlowNames.EmailOTPSignup]: EmailOTPSignupFlow,
  [SignUpFlowNames.PasskeySignupWithEmailOTPFallback]: PasskeySignupWithEmailOTPFallbackFlow,
  [LoginFlowNames.PasskeyLoginWithEmailOTPFallback]: PasskeyLoginWithEmailOTPFallbackFlow
};

export const ScreensFlow = () => {
  const {currentFlow, currentScreen} = useFlowHandler();

  if (!currentFlow || !currentScreen) {
    return null;
  }

  const Screen = flows[currentFlow]?.[currentScreen] as React.FC;
  console.log('ScreensFlow', Screen)
  return <Screen/>;
};
