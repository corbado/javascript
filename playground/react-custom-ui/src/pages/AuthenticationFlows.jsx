import { SignUpWithEmailOtpTest } from './SingUpWithEmailOtpTest';
import { PasskeySignupTest } from './PasskeySignupTest';
import { PasskeyLoginTest } from './PasskeyLoginTest';
import { LoginFlowNames, SignUpFlowNames, useCorbadoFlowHandler } from '@corbado/react-sdk';
import React, { useState } from 'react';

const flows = {
  login: {
    component: <PasskeyLoginTest />,
    flowName: LoginFlowNames.PasskeyLoginWithEmailOTPFallback,
  },
  'signup-1': {
    component: <PasskeySignupTest />,
    flowName: SignUpFlowNames.PasskeySignupWithEmailOTPFallback,
  },
  'signup-2': {
    component: <SignUpWithEmailOtpTest />,
    flowName: SignUpFlowNames.EmailOTPSignup,
  },
};

export function AuthenticationFlows() {
  const [currentFlow, setCurrentFlow] = useState(null);
  const { changeFlow } = useCorbadoFlowHandler();

  function handleFlowChange(flowKey) {
    const flow = flows[flowKey];
    changeFlow(flow.flowName);
    setCurrentFlow(flow.component);
  }

  return (
    currentFlow ?? (
      <div>
        <h3>Please select the flow you want to test:</h3>
        <button onClick={() => handleFlowChange('login')}>Passkey Login with Email OTP Fallback</button>
        <button onClick={() => handleFlowChange('signup-1')}>Passkey Signup with Email OTP Fallback</button>
        <button onClick={() => handleFlowChange('signup-2')}>Email OTP Signup</button>
      </div>
    )
  );
}
