import {
  useCorbadoAuth,
  useCorbadoFlowHandler,
  canUsePasskeys,
} from "@corbado/react-sdk";
import React from "react";

export function InitiateLogin() {
  const { initiateLogin, passkeyLogin } = useCorbadoAuth();
  const { navigateToNextScreen } = useCorbadoFlowHandler();
  const [username, setUsername] = React.useState("");

  const initiateAuthentication = async (event) => {
    event.preventDefault();
    try {
      initiateLogin(username);

      debugger;
      const hasPasskeySupport = await canUsePasskeys();

      if (hasPasskeySupport) {
        const success = await passkeyLogin();

        if (success) {
          void navigateToNextScreen({ success: true });
          return;
        } else {
          void navigateToNextScreen({ failure: true });
          return;
        }
      }

      void navigateToNextScreen({ sendOtpEmail: true });
    } catch (error) {
      console.log(error);
      void navigateToNextScreen({ failure: true });
    }
  };

  return (
    <form onSubmit={initiateAuthentication}>
      <label htmlFor="username">Username:</label>
      <input
        type="text"
        value={username}
        autoComplete="username webauthn"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input type="submit" value="Submit" />
    </form>
  );
}
