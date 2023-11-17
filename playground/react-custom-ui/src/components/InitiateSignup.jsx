import { useCorbadoAuth, useCorbadoFlowHandler } from "@corbado/react-sdk";
import React from "react";

/**
 * InitiateSignUp allows the user to provide all information required to create his account.
 * This page will also check if the unqiue identifier (in this case the email address) is still available.
 * => if this is not the case as error will be shown
 *
 * If the user already has an account he can navigate to the login screen.
 */
export function InitiateSignUp() {
  const { initiateSignup } = useCorbadoAuth();
  const { navigateToNextScreen } = useCorbadoFlowHandler();
  const [email, setEmail] = React.useState("");
  const [username, setUsername] = React.useState("");

  const initiateAuthentication = async (event) => {
    event.preventDefault();
    try {
      initiateSignup(email, username);
      navigateToNextScreen();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <h1>Create your account</h1>
      {/* <p>
        You already have an account? <a href="">Log in</a>
      </p> */}
      <form onSubmit={initiateAuthentication}>
        <label>Email:</label>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input type="submit" value="Submit" />
      </form>
    </>
  );
}
