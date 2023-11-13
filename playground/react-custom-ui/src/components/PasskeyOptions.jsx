import { useCorbadoAuth, useCorbadoFlowHandler } from "@corbado/react-sdk";
import React from "react";

export function PasskeyOption() {
  const { navigateToNextScreen } = useCorbadoFlowHandler();
  const { passkeyAppend } = useCorbadoAuth();

  const appendPasskey = async () => {
    try {
      const result = await passkeyAppend();
      if (result) {
        navigateToNextScreen({ success: true });
      } else {
        navigateToNextScreen({ failure: true });
      }
    } catch (error) {
      console.log(error);
      navigateToNextScreen({ failure: true });
    }
  };
  return (
    <div>
      <h1>Passkey Option</h1>
      <button onClick={() => navigateToNextScreen({ showBenefits: true })}>
        Passkeys
      </button>
      <button onClick={() => navigateToNextScreen({ maybeLater: true })}>
        Maybe Later
      </button>
      <button onClick={appendPasskey}>Append Passkey</button>
      <button onClick={() => navigateToNextScreen({ failure: true })}>
        Append Passkey Failure
      </button>
    </div>
  );
}
