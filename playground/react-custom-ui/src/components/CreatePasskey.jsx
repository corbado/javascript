import { useCorbadoAuth, useCorbadoFlowHandler } from '@corbado/react-sdk';
import React from 'react';

/**
 * CreatePasskey gives the user the choice if he
 * - signs up by creating a passkey
 * - signs up using email OTP
 *
 * Depending on the user's choice, react-sdk is used to initiate the account creation.
 * This screen could also be omitted if you want to limit the user's freedom in this decision.
 * In this case the logic would need to be moved to the first screen (CreatePasskey.jsx in our example).
 */
export function CreatePasskey() {
  const { navigateToNextScreen, navigateBack } = useCorbadoFlowHandler();
  const { passkeyRegister } = useCorbadoAuth();

  const createPasskey = async () => {
    try {
      const result = await passkeyRegister();
      if (result) {
        await navigateToNextScreen({ success: true });
      } else {
        await navigateToNextScreen({ failure: true });
      }
    } catch (error) {
      console.log(error);
      await navigateToNextScreen({ failure: true });
    }
  };
  return (
    <div>
      <h1>
        Let’s get you set up <a href={() => navigateToNextScreen({ showBenefits: true })}>with Passkeys</a>
      </h1>
      <p>We’ll create an account for xxx@xxx.com.</p>

      <p>
        <button onClick={createPasskey}>Register with Passkey</button>
      </p>
      <p>
        <button onClick={() => navigateToNextScreen({ sendOtpEmail: true })}>Enter OTP</button>
      </p>
      <p>
        <button onClick={() => navigateBack()}>Back</button>
      </p>
    </div>
  );
}
