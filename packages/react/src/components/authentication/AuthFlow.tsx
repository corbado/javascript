import { useCorbado } from '@corbado/react-sdk';
import type {
  EmailVerifyBlock,
  LoginInitBlock,
  PasskeyAppendBlock,
  PasskeyAppendedBlock,
  PasskeyVerifyBlock,
  PhoneVerifyBlock,
  SignupInitBlock,
} from '@corbado/shared-ui';
import { BlockTypes, InitState, ScreenNames } from '@corbado/shared-ui';
import type { FC } from 'react';
import React, { useMemo } from 'react';

import useErrorHandling from '../../hooks/useErrorHandling';
import useFlowHandler from '../../hooks/useFlowHandler';
import { EmailLinkSent } from '../../screens/auth-blocks/email-verify/EmailLinkSent';
import { EmailOtp } from '../../screens/auth-blocks/email-verify/EmailOtp';
import { LoginInit } from '../../screens/auth-blocks/login-init/LoginInit';
import { EditUserData } from '../../screens/auth-blocks/passkey-append/EditUserData';
import { PasskeyAppend } from '../../screens/auth-blocks/passkey-append/PasskeyAppend';
import { PasskeyBenefits as PasskeyAppendPasskeyBenefits } from '../../screens/auth-blocks/passkey-append/PasskeyBenefits';
import { PasskeyError as PasskeyAppendPasskeyError } from '../../screens/auth-blocks/passkey-append/PasskeyError';
import { PasskeyAppended } from '../../screens/auth-blocks/passkey-appended/PasskeyAppended';
import { PasskeyBackground } from '../../screens/auth-blocks/passkey-verify/PasskeyBackground';
import { PasskeyBenefits as PasskeyVerifyPasskeyBenefits } from '../../screens/auth-blocks/passkey-verify/PasskeyBenefits';
import { PasskeyError as PasskeyVerifyPasskeyError } from '../../screens/auth-blocks/passkey-verify/PasskeyError';
import { PhoneOtp } from '../../screens/auth-blocks/phone-verify/PhoneOtp';
import { SignupInit } from '../../screens/auth-blocks/signup-init/SignupInit';
import Loading from '../ui/Loading';
import { ComponentUnavailableError } from '../ui2/errors/ComponentUnavailable';
import ErrorPopup from '../ui2/errors/ErrorPopup';

export const AuthFlow: FC = () => {
  const { isDevMode, customerSupportEmail } = useErrorHandling();
  const { currentScreen, initState } = useFlowHandler();
  const { globalError } = useCorbado();

  const screenComponent = useMemo(() => {
    if (!currentScreen) {
      return null;
    }

    switch (currentScreen.block.type) {
      case BlockTypes.LoginInit:
        return <LoginInit block={currentScreen.block as LoginInitBlock} />;
      case BlockTypes.SignupInit:
        return <SignupInit block={currentScreen.block as SignupInitBlock} />;
      case BlockTypes.EmailVerify:
        switch (currentScreen.screen) {
          case ScreenNames.EmailLinkSent:
            return <EmailLinkSent block={currentScreen.block as EmailVerifyBlock} />;
          case ScreenNames.EmailOtpVerification:
            return <EmailOtp block={currentScreen.block as EmailVerifyBlock} />;
          case ScreenNames.EmailLinkVerification:
            return <EmailOtp block={currentScreen.block as EmailVerifyBlock} />;
          default:
            throw new Error(`Invalid screen: ${currentScreen.screen}`);
        }
      case BlockTypes.PhoneVerify:
        return <PhoneOtp block={currentScreen.block as PhoneVerifyBlock} />;
      case BlockTypes.PasskeyAppend:
        switch (currentScreen.screen) {
          case ScreenNames.PasskeyAppend:
            return <PasskeyAppend block={currentScreen.block as PasskeyAppendBlock} />;
          case ScreenNames.PasskeyBenefits:
            return <PasskeyAppendPasskeyBenefits block={currentScreen.block as PasskeyAppendBlock} />;
          case ScreenNames.PasskeyError:
            return <PasskeyAppendPasskeyError block={currentScreen.block as PasskeyAppendBlock} />;
          case ScreenNames.EditUserData:
            return <EditUserData block={currentScreen.block as PasskeyAppendBlock} />;
          default:
            throw new Error(`Invalid screen: ${currentScreen.screen}`);
        }
      case BlockTypes.PasskeyVerify:
        switch (currentScreen.screen) {
          case ScreenNames.PasskeyBackground:
            return <PasskeyBackground block={currentScreen.block as PasskeyVerifyBlock} />;
          case ScreenNames.PasskeyBenefits:
            return <PasskeyVerifyPasskeyBenefits block={currentScreen.block as PasskeyVerifyBlock} />;
          case ScreenNames.PasskeyError:
            return <PasskeyVerifyPasskeyError block={currentScreen.block as PasskeyVerifyBlock} />;
          default:
            throw new Error(`Invalid screen: ${currentScreen.screen}`);
        }
      case BlockTypes.PasskeyAppended:
        return <PasskeyAppended block={currentScreen.block as PasskeyAppendedBlock} />;
      case BlockTypes.Completed:
        return null;
    }
  }, [currentScreen]);

  // Render the component if it exists, otherwise a fallback or null
  return initState === InitState.Failed ? (
    <ComponentUnavailableError />
  ) : initState === InitState.Initializing ? (
    <Loading />
  ) : (
    <div className='new-ui-component'>
      <div className='cb-container-2'>
        {globalError && (
          <ErrorPopup
            isDevMode={isDevMode}
            error={globalError}
            customerSupportEmail={customerSupportEmail}
          />
        )}
        {screenComponent}
      </div>
    </div>
  );
};
