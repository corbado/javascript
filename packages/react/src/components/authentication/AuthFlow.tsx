import { useCorbado } from '@corbado/react-sdk';
import type { EmailVerifyBlock, PasskeyAppendBlock, PasskeyAppendedBlock, SignupInitBlock } from '@corbado/shared-ui';
import { ScreenNames } from '@corbado/shared-ui';
import type { FC } from 'react';
import React, { useMemo } from 'react';

import useErrorHandling from '../../hooks/useErrorHandling';
import useFlowHandler from '../../hooks/useFlowHandler';
import { EmailOtp } from '../../screens/auth-blocks/email-verify/EmailOtp';
import { PasskeyAppend } from '../../screens/auth-blocks/passkey-append/PasskeyAppend';
import { PasskeyBenefits } from '../../screens/auth-blocks/passkey-append/PasskeyBenefits';
import { PasskeyAppended } from '../../screens/auth-blocks/passkey-appended/PasskeyAppended';
import { InitSignup } from '../../screens/auth-blocks/signup-init/InitSignup';
import Loading from '../ui/Loading';
import { ErrorBoundary } from './ErrorBoundary';

export type ScreenMap = {
  [K in ScreenNames]?: (block: any) => React.ReactNode;
};

const componentMap: ScreenMap = {
  [ScreenNames.Start]: (block: SignupInitBlock) => <InitSignup block={block} />,
  [ScreenNames.EmailOTPVerification]: (block: EmailVerifyBlock) => <EmailOtp block={block} />,
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
