import { useCorbadoAuth, useCorbadoFlowHandler } from "@corbado/react-sdk";
import React from "react";

export function CreatePasskey() {
  const { navigateToNextScreen } = useCorbadoFlowHandler();
  const { passkeyRegister } = useCorbadoAuth();

  const createPasskey = async () => {
    try {
      const result = await passkeyRegister();
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
      <h1>Create Passkey</h1>
      <button onClick={createPasskey}>Register with Passkey</button>
      <button onClick={() => navigateToNextScreen({ showBenefits: true })}>
        Passkeys
      </button>
      <button onClick={() => navigateToNextScreen({ sendOtpEmail: true })}>
        Enter OTP
      </button>
      <button onClick={() => navigateToNextScreen({ failure: true })}>
        Append Passkey Failure
      </button>
    </div>
  );
}
