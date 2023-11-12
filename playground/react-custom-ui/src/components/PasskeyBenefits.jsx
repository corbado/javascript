import { useCorbadoAuth, useCorbadoFlowHandler } from "@corbado/react-sdk";
import React from "react";

/**
 * PasskeyBenefits is an informative screen for the user to explain passkeys.
 */
export function PasskeyBenefits() {
  const { navigateToNextScreen } = useCorbadoFlowHandler();
  const { isAuthenticated, passkeyAppend, passkeyRegister } = useCorbadoAuth();

  return (
    <div>
      <h1>Passkey Benefits</h1>
      <button onClick={() => navigateToNextScreen({ maybeLater: true })}>
        Maybe Later
      </button>
      <button onClick={() => navigateToNextScreen({ appendSuccessful: true })}>
        Append Passkey
      </button>
      <button onClick={() => navigateToNextScreen({ appendFailed: true })}>
        Append Passkey Failure
      </button>
    </div>
  );
}
