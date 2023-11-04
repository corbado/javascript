import { useCorbadoAuthContext, useAppContext } from "@corbado/react-sdk";
import React from "react";

export function VerifyOtp() {
  const { verifyOTP } = useCorbadoAuthContext();
  const { navigateBack } = useAppContext();
  const [otp, setOtp] = React.useState("");

  const handleSubmitOtp = async (event) => {
    event.preventDefault();
    try {
      const resp = await verifyOTP(otp);
      console.log(resp);
    } catch (error) {
      console.log(error);
    }
  };

  return (
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
      <button onClick={navigateBack}>Back</button>
    </form>
  );
}
