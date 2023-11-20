import { useCorbadoAuth, useCorbadoFlowHandler } from '@corbado/react-sdk';
import React from 'react';

export function VerifyOtp() {
  const { verifyOTP, getEmail } = useCorbadoAuth();
  const { navigateBack, navigateToNextScreen } = useCorbadoFlowHandler();
  const [otp, setOtp] = React.useState('');

  const handleSubmitOtp = async event => {
    event.preventDefault();
    try {
      await verifyOTP(otp);
      navigateToNextScreen();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      OTP has been sent to {getEmail()}. Please enter it below.
      <div>
        <form onSubmit={handleSubmitOtp}>
          <label>OTP:</label>
          <input
            type='text'
            value={otp}
            onChange={e => setOtp(e.target.value)}
          />
          <input
            type='submit'
            value='Submit'
          />
          <button onClick={navigateBack}>Back</button>
        </form>
      </div>
    </div>
  );
}
