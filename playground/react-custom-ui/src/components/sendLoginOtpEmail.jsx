import { useCorbadoAuth, useCorbadoFlowHandler } from "@corbado/react-sdk";
import React, { useEffect } from "react";

export function VerifyOtp() {
  const { emailOtpLogin, verifyOTP, getEmail, getUsername } = useCorbadoAuth();
  const { navigateBack, navigateToNextScreen } = useCorbadoFlowHandler();
  const [otp, setOtp] = React.useState("");

  useEffect(() => {
    try {
      void emailOtpLogin();
    } catch (error) {
      console.log(error);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmitOtp = async (event) => {
    event.preventDefault();
    try {
      await verifyOTP(otp);
      navigateToNextScreen({ success: true });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      OTP has been sent to {getEmail()}. Please enter it below.
      <div>
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
      </div>
    </div>
  );
}
