import { useCorbado } from '@corbado/react-sdk';
import { ScreenNames } from '@corbado/shared-ui';
import type { FC } from 'react';
import React, { useCallback, useMemo } from 'react';

import useErrorHandling from '../../hooks/useErrorHandling';
import useFlowHandler from '../../hooks/useFlowHandler';
import { PasskeyAppend } from '../../screens/base/authentication/passkey-append/PasskeyAppend';
import { PasskeyBenefits } from '../../screens/base/authentication/passkey-append/PasskeyBenefits';
import { PasskeyAppended } from '../../screens/base/authentication/passkey-appended/PasskeyAppended';
import { InitSignup } from '../../screens/base/authentication/signup-init/InitSignup';
import Loading from '../ui/Loading';
import { ErrorBoundary } from './ErrorBoundary';

export type ScreenMap = {
  [K in ScreenNames]?: () => React.ReactNode;
};

const componentMap: ScreenMap = {
  [ScreenNames.Start]: InitSignup,
  [ScreenNames.PasskeyCreate]: PasskeyAppend,
  [ScreenNames.EmailOTPVerification]: InitSignup,
  [ScreenNames.EmailLinkSent]: InitSignup,
  [ScreenNames.EmailLinkVerification]: InitSignup,
  [ScreenNames.PasskeyAppend]: PasskeyAppend,
  [ScreenNames.PasskeyBenefits]: PasskeyBenefits,
  [ScreenNames.PasskeySuccess]: PasskeyAppended,
  [ScreenNames.PasskeyError]: InitSignup,
};

export const AuthFlow: FC = () => {
  const { isDevMode, customerSupportEmail } = useErrorHandling();
  const { currentScreen, initialized } = useFlowHandler();
  const { globalError } = useCorbado();

  const ScreenComponent = useMemo(() => {
    if (!currentScreen) {
      return null;
    }

    return componentMap[currentScreen];
  }, [componentMap, currentScreen]);

  const EndComponent = useCallback(() => {
    const EndComponentScreen = componentMap[ScreenNames.End];
    return EndComponentScreen ? <EndComponentScreen /> : null;
  }, [componentMap]);

  // Render the component if it exists, otherwise a fallback or null
  return (
    <ErrorBoundary
      globalError={globalError}
      isDevMode={isDevMode}
      customerSupportEmail={customerSupportEmail}
    >
      {initialized ? ScreenComponent ? <ScreenComponent /> : <EndComponent /> : <Loading />}
    </ErrorBoundary>
  );
};
