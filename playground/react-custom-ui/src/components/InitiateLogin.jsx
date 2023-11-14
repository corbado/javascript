import {useCorbadoAuth, useCorbadoFlowHandler} from "@corbado/react-sdk";
import {useState} from "react";

// TODO: set up this screen + the rest of the login screens)
export function InitiateLogin() {
  const {initiateAuth} = useCorbadoAuth();
  const {navigateToNextScreen} = useCorbadoFlowHandler();
  const [email, setEmail] = useState("");

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
    <>
      <h1>Welcome back!</h1>
      <p>Don’t have an account yet? <a href=''>Create account</a></p>
      <form onSubmit={initiateAuthentication}>
        <label>
          Email:
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <input type="submit" value="Submit"/>
      </form>
    </>
  );
}
