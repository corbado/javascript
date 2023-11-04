import { useCorbadoAuthContext, useAppContext } from "@corbado/react-sdk";
import React from "react";

export function InitiateSignUp() {
  const { sendEmailWithOTP } = useCorbadoAuthContext();
  const { navigateToNextScreen } = useAppContext();
  const [email, setEmail] = React.useState("");
  const [username, setUsername] = React.useState("");

  const handleSendOtp = async (event) => {
    event.preventDefault();
    try {
      await sendEmailWithOTP(email, username);
      navigateToNextScreen();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSendOtp}>
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
