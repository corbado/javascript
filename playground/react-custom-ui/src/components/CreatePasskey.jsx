import { useCorbadoAuth, useCorbadoFlowHandler } from "@corbado/react-sdk";
import React from "react";

export function CreatePasskey() {
  const { navigateToNextScreen } = useCorbadoFlowHandler();
  const { passkeyRegister } = useCorbadoAuth();

  const createPasskey = async () => {
    try {
      const result = await passkeyRegister();
      if (result) {
        navigateToNextScreen({ createSuccessful: true });
      } else {
        navigateToNextScreen({ createFailed: true });
      }
    } catch (error) {
      console.log(error);
      navigateToNextScreen({ createFailed: true });
    }
  };
  return (
    <div>
      <h1>Create Passkey</h1>
      <button onClick={createPasskey}>Register with Passkey</button>
      <button onClick={() => navigateToNextScreen({ showBenefits: true })}>
        Passkeys
      </button>
      <button onClick={() => navigateToNextScreen({ enterOtp: true })}>
        Enter OTP
      </button>
      <button onClick={() => navigateToNextScreen({ createFailed: true })}>
        Append Passkey Failure
      </button>
    </div>
  );
}
