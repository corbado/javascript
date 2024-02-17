import { useCorbado } from '@corbado/react-sdk';
import type { PasskeyAppendBlock, PasskeyAppendedBlock, SignupInitBlock } from '@corbado/shared-ui';
import { ScreenNames } from '@corbado/shared-ui';
import type { FC } from 'react';
import React, { useMemo } from 'react';

import useErrorHandling from '../../hooks/useErrorHandling';
import useFlowHandler from '../../hooks/useFlowHandler';
import { PasskeyAppend } from '../../screens/base/authentication/passkey-append/PasskeyAppend';
import { PasskeyBenefits } from '../../screens/base/authentication/passkey-append/PasskeyBenefits';
import { PasskeyAppended } from '../../screens/base/authentication/passkey-appended/PasskeyAppended';
import { InitSignup } from '../../screens/base/authentication/signup-init/InitSignup';
import Loading from '../ui/Loading';
import { ErrorBoundary } from './ErrorBoundary';

export type ScreenMap = {
  [K in ScreenNames]?: (block: any) => React.ReactNode;
};

const componentMap: ScreenMap = {
  [ScreenNames.Start]: (block: SignupInitBlock) => <InitSignup block={block} />,
  [ScreenNames.PasskeyCreate]: PasskeyAppend,
  [ScreenNames.EmailOTPVerification]: InitSignup,
  [ScreenNames.EmailLinkSent]: InitSignup,
  [ScreenNames.EmailLinkVerification]: InitSignup,
  [ScreenNames.PasskeyAppend]: (block: PasskeyAppendBlock) => <PasskeyAppend block={block} />,
  [ScreenNames.PasskeyBenefits]: (block: PasskeyAppendBlock) => <PasskeyBenefits block={block} />,
  [ScreenNames.PasskeySuccess]: (block: PasskeyAppendedBlock) => <PasskeyAppended block={block} />,
  [ScreenNames.PasskeyError]: InitSignup,
};

export const AuthFlow: FC = () => {
  const { isDevMode, customerSupportEmail } = useErrorHandling();
  const { currentScreen, initialized } = useFlowHandler();
  const { globalError } = useCorbado();

  const screenComponent = useMemo(() => {
    if (!currentScreen) {
      return null;
    }

    const componentBuilder = componentMap[currentScreen.screen];
    if (!componentBuilder) {
      return null;
    }

    return componentBuilder(currentScreen.block);
  }, [componentMap, currentScreen]);

  // Render the component if it exists, otherwise a fallback or null
  return (
    <ErrorBoundary
      globalError={globalError}
      isDevMode={isDevMode}
      customerSupportEmail={customerSupportEmail}
    >
      {initialized ? screenComponent ? screenComponent : <Loading /> : <Loading />}
    </ErrorBoundary>
  );
};
