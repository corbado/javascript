import { useCorbadoSignUp } from "@corbado/react-sdk";
import React from "react";

export function SignUpWithEmailOtpTest() {
  const { sendEmailWithOTP, verifyOTP } = useCorbadoSignUp();
  const [email, setEmail] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [otp, setOtp] = React.useState("");
  const [isOtpSent, setIsOtpSent] = React.useState(false);

  const handleSendOtp = async (event) => {
    event.preventDefault();
    try {
      setIsOtpSent(true);
      await sendEmailWithOTP(email, username);
    } catch (error) {
      alert(error);
    }
  };

  const handleSubmitOtp = async (event) => {
    event.preventDefault();
    try {
      const resp = await verifyOTP(otp);
      console.log(resp);
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div>
      {!isOtpSent ? (
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
      ) : (
        <form onSubmit={handleSubmitOtp}>
          <label>
            OTP:
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </label>
          <input type="submit" value="Submit" />
        </form>
      )}
    </div>
  );
}
