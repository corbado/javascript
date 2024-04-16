import type {
  ConfirmProcessAbortBlock,
  ContinueOnOtherEnvBlock,
  EmailVerifyBlock,
  LoginInitBlock,
  MissingFieldsBlock,
  PasskeyAppendBlock,
  PasskeyAppendedBlock,
  PasskeyVerifyBlock,
  PhoneVerifyBlock,
  SignupInitBlock,
} from '@corbado/shared-ui';
import { BlockTypes, InitState, ScreenNames } from '@corbado/shared-ui';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import React, { useMemo } from 'react';

import useErrorHandling from '../../hooks/useErrorHandling';
import useFlowHandler from '../../hooks/useFlowHandler';
import { ConfirmProcessAbort } from '../../screens/auth-blocks/confirm-process-abort/ConfirmProcessAbort';
import { EditEmail } from '../../screens/auth-blocks/email-verify/EditEmail';
import { EmailLinkSent } from '../../screens/auth-blocks/email-verify/EmailLinkSent';
import { EmailLinkSuccess } from '../../screens/auth-blocks/email-verify/EmailLinkSuccess';
import { EmailLinkVerification } from '../../screens/auth-blocks/email-verify/EmailLinkVerification';
import { EmailOtp } from '../../screens/auth-blocks/email-verify/EmailOtp';
import { LoginInit } from '../../screens/auth-blocks/login-init/LoginInit';
import { MissingFields } from '../../screens/auth-blocks/missing-fields/MissingFields';
import { EditUserData } from '../../screens/auth-blocks/passkey-append/EditUserData';
import { PasskeyAppend } from '../../screens/auth-blocks/passkey-append/PasskeyAppend';
import { PasskeyError as PasskeyAppendPasskeyError } from '../../screens/auth-blocks/passkey-append/PasskeyError';
import { PasskeyAppended } from '../../screens/auth-blocks/passkey-appended/PasskeyAppended';
import { PasskeyBackground } from '../../screens/auth-blocks/passkey-verify/PasskeyBackground';
import { PasskeyError as PasskeyVerifyPasskeyError } from '../../screens/auth-blocks/passkey-verify/PasskeyError';
import { EditPhone } from '../../screens/auth-blocks/phone-verify/EditPhone';
import { PhoneOtp } from '../../screens/auth-blocks/phone-verify/PhoneOtp';
import { SignupInit } from '../../screens/auth-blocks/signup-init/SignupInit';
import { ComponentUnavailableError } from '../ui/errors/ComponentUnavailable';
import ErrorPopup from '../ui/errors/ErrorPopup';
import { FreemiumBadge } from '../ui/FreemiumBadge';
import { LoadingSpinner } from '../ui/LoadingSpinner';

export const AuthFlow: FC = () => {
  const { isDevMode, customerSupportEmail } = useErrorHandling();
  const { currentScreen, initState } = useFlowHandler();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // this delays showing a loading screen for a very short period of time
    // the idea is to reduce flickering when the loading screen is only shown for a very short time
    if (initState !== InitState.Initializing || loading) {
      setLoading(initState === InitState.Initializing);
      return;
    }

    const timeout = setTimeout(() => {
      setLoading(true);
    }, 100);

    return () => {
      clearTimeout(timeout);
    };
  }, [initState]);

  const screenComponent = useMemo(() => {
    if (!currentScreen) {
      return null;
    }

    switch (currentScreen.block.type) {
      case BlockTypes.ConfirmProcessAbort:
        return <ConfirmProcessAbort block={currentScreen.block as ConfirmProcessAbortBlock} />;
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
            return <EmailLinkVerification block={currentScreen.block as EmailVerifyBlock} />;
          case ScreenNames.EditEmail:
            return <EditEmail block={currentScreen.block as EmailVerifyBlock} />;
          default:
            throw new Error(`Invalid screen: ${currentScreen.screen}`);
        }
      case BlockTypes.PhoneVerify:
        switch (currentScreen.screen) {
          case ScreenNames.PhoneOtp:
            return <PhoneOtp block={currentScreen.block as PhoneVerifyBlock} />;
          case ScreenNames.EditPhone:
            return <EditPhone block={currentScreen.block as PhoneVerifyBlock} />;
          default:
            throw new Error(`Invalid screen: ${currentScreen.screen}`);
        }
      case BlockTypes.PasskeyAppend:
        switch (currentScreen.screen) {
          case ScreenNames.PasskeyAppend:
            return <PasskeyAppend block={currentScreen.block as PasskeyAppendBlock} />;
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
          case ScreenNames.PasskeyError:
            return <PasskeyVerifyPasskeyError block={currentScreen.block as PasskeyVerifyBlock} />;
          default:
            throw new Error(`Invalid screen: ${currentScreen.screen}`);
        }
      case BlockTypes.PasskeyAppended:
        return <PasskeyAppended block={currentScreen.block as PasskeyAppendedBlock} />;
      case BlockTypes.Completed:
        return null;
      case BlockTypes.ContinueOnOtherEnv:
        return <EmailLinkSuccess block={currentScreen.block as ContinueOnOtherEnvBlock} />;
      case BlockTypes.MissingFields:
        return <MissingFields block={currentScreen.block as MissingFieldsBlock} />;
    }
  }, [currentScreen]);

  const renderContent = () => {
    if (initState === InitState.Failed) {
      return <ComponentUnavailableError />;
    }

    if (loading) {
      return <LoadingSpinner className='cb-initital-loading-spinner' />;
    }

    return (
      <>
        {currentScreen?.block.error && (
          <ErrorPopup
            isDevMode={isDevMode}
            error={currentScreen?.block.error}
            customerSupportEmail={customerSupportEmail}
          />
        )}
        <div className='cb-container-body'>{screenComponent}</div>
      </>
    );
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div className='cb-container'>{renderContent()}</div>
      <FreemiumBadge />
    </div>
  );
};
