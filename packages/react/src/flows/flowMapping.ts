import { PasskeyLoginWithEmailOtpFallbackScreens } from '@corbado/react-sdk';
import { EmailOtpSignupScreens, PasskeySignupWithEmailOtpFallbackScreens } from '@corbado/web-core';

import { CreatePasskey } from '../screens/CreatePasskey';
import { EmailOTP } from '../screens/EmailOTP';
import { InitiateLogin } from '../screens/InitiateLogin';
import { InitiateSignup } from '../screens/InitiateSignup';
import { PasskeyCreationError } from '../screens/PasskeyCreationError';
import { PasskeyCreationSuccess } from '../screens/PasskeyCreationSuccess';
import { PasskeySignup } from '../screens/PasskeySignup';

export const EmailOTPSignupFlow = {
  [EmailOtpSignupScreens.Start]: InitiateSignup,
  [EmailOtpSignupScreens.EnterOtp]: EmailOTP,
};

export const PasskeySignupWithEmailOTPFallbackFlow = {
  [PasskeySignupWithEmailOtpFallbackScreens.Start]: InitiateSignup,
  [PasskeySignupWithEmailOtpFallbackScreens.CreatePasskey]: PasskeySignup,
  [PasskeySignupWithEmailOtpFallbackScreens.PasskeyBenefits]: CreatePasskey,
  [PasskeySignupWithEmailOtpFallbackScreens.PasskeyWelcome]: PasskeyCreationSuccess,
  [PasskeySignupWithEmailOtpFallbackScreens.PasskeyError]: PasskeyCreationError,
  [PasskeySignupWithEmailOtpFallbackScreens.EnterOtp]: EmailOTP,
};

export const PasskeyLoginWithEmailOTPFallbackFlow = {
  [PasskeyLoginWithEmailOtpFallbackScreens.Start]: InitiateLogin,
};
