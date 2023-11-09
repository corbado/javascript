import { useCorbadoAuth, useCorbadoFlowHandler } from "@corbado/react-sdk";
import React from "react";

export function InitiateSignUp() {
  const { initiateAuth } = useCorbadoAuth();
  const { navigateToNextScreen } = useCorbadoFlowHandler();
  const [email, setEmail] = React.useState("");
  const [username, setUsername] = React.useState("");

  const initiateAuthentication = async (event) => {
    event.preventDefault();
    try {
      initiateAuth(email, username);
      navigateToNextScreen();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={initiateAuthentication}>
      <label>
        Email:
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label>
        Username:
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </label>
      <input type="submit" value="Submit" />
    </form>
  );
}
