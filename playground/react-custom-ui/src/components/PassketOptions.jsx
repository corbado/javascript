import { useCorbadoAuth, useCorbadoFlowHandler } from "@corbado/react-sdk";
import React from "react";

export function PasskeyOption() {
  const { navigateToNextScreen } = useCorbadoFlowHandler();
  const { passkeyAppend } = useCorbadoAuth();

  const appendPasskey = async () => {
    try {
      const result = await passkeyAppend();
      if (result) {
        navigateToNextScreen({ appendSuccessful: true });
      } else {
        navigateToNextScreen({ appendFailed: true });
      }
    } catch (error) {
      console.log(error);
      navigateToNextScreen({ appendFailed: true });
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
      <button onClick={() => navigateToNextScreen({ appendFailed: true })}>
        Append Passkey Failure
      </button>
    </div>
  );
}
