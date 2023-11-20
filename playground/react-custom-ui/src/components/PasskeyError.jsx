import { useCorbadoFlowHandler } from '@corbado/react-sdk';
import React from 'react';

export function PasskeyError() {
  const { navigateToNextScreen } = useCorbadoFlowHandler();
  return (
    <div>
      <h1>Passkey Error</h1>
      <button onClick={() => navigateToNextScreen({ success: true })}>Success</button>
      <button onClick={() => navigateToNextScreen({ cancel: true })}>Cancel</button>
      <button onClick={() => navigateToNextScreen({ sendOtpEmail: true })}>Send Email Otp</button>
      <button onClick={() => navigateToNextScreen({ cancel: true, isUserAuthenticated: true })}>
        Cancel for authenticated user
      </button>
    </div>
  );
}
