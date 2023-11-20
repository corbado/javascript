import { useCorbadoFlowHandler } from '@corbado/react-sdk';
import React from 'react';
import { SignupWithEmailOtpFlows } from '../flows/SignupWithEmailOtp';

export function SignUpWithEmailOtpTest() {
  const { currentScreenName } = useCorbadoFlowHandler();

  return <div>{SignupWithEmailOtpFlows[currentScreenName]}</div>;
}
