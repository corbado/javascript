import {useCorbadoFlowHandler} from "@corbado/react-sdk";
import React from "react";

/**
 * PasskeyBenefits is an informative screen for the user to explain passkeys.
 */
export function PasskeyBenefits() {
  const {navigateToNextScreen} = useCorbadoFlowHandler();

  return (
    <div>
      <h1>Passkey Benefits</h1>
      <button onClick={() => navigateToNextScreen({maybeLater: true})}>
        Maybe Later for unauthenticated user
      </button>
      <button
        onClick={() =>
          navigateToNextScreen({maybeLater: true, isUserAuthenticated: true})
        }
      >
        Maybe Later for authenticated user
      </button>
      <button onClick={() => navigateToNextScreen({success: true})}>
        Passkey Successful
      </button>
      <button onClick={() => navigateToNextScreen({failure: true})}>
        Passkey Failure
      </button>
      <button
        onClick={() =>
          navigateToNextScreen({failure: true, isUserAuthenticated: true})
        }
      >
        Passkey Failure for authenticated user
      </button>
    </div>
  );
}
