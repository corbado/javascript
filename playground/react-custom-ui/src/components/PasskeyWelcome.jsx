import {useCorbadoFlowHandler} from "@corbado/react-sdk";
import React from "react";

export function PasskeyWelcome() {
  const {navigateToNextScreen} = useCorbadoFlowHandler();
  return (
    <div>
      <h1>Passkey Welcome</h1>
      <button onClick={() => navigateToNextScreen()}>Continue</button>
    </div>
  );
}
