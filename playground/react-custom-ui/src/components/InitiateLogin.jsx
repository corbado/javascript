import { useCorbadoAuth, useCorbadoFlowHandler } from "@corbado/react-sdk";
import React from "react";

export function InitiateLogin() {
  const { initiateAuth } = useCorbadoAuth();
  const { navigateToNextScreen } = useCorbadoFlowHandler();
  const [username, setUsername] = React.useState("");

  const initiateAuthentication = async (event) => {
    event.preventDefault();
    try {
      initiateAuth(username);
      void navigateToNextScreen();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={initiateAuthentication}>
      <label for="username">Username:</label>
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
