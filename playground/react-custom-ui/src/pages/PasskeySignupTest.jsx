import {useCorbadoFlowHandler} from "@corbado/react-sdk";
import React from "react";
import {PasskeySignupWithEmailOtpFallback} from "../flows/PasskeySignupWithEmailOTPFallback";

export function PasskeySignupTest() {
  const {currentScreenName} = useCorbadoFlowHandler();

  return <div>{PasskeySignupWithEmailOtpFallback[currentScreenName]}</div>;
}
