import { useCorbadoFlowHandler } from '@corbado/react-sdk';
import React from 'react';
import { PasskeyLoginWithEmailOtpFallback } from '../flows/PasskeyLoginWithEmailOtpFallback';

export function PasskeyLoginTest() {
  const { currentScreenName } = useCorbadoFlowHandler();

  return <div>{PasskeyLoginWithEmailOtpFallback[currentScreenName]}</div>;
}
