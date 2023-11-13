import type {
  EmailOtpSignupScreens,
  PasskeyLoginWithEmailOtpFallbackScreens,
  PasskeySignupWithEmailOtpFallbackScreens,
  ScreenNames,
} from "@corbado/react-sdk";

export type EmailOTPSignupScreensList = {
  [K in EmailOtpSignupScreens]?: React.ReactNode;
};

export type PasskeySignupWithEmailOtpFallbackScreensList = {
  [K in PasskeySignupWithEmailOtpFallbackScreens]?: React.ReactNode;
};

export type PasskeyLoginWithEmailOtpFallbackScreensList = {
  [K in PasskeyLoginWithEmailOtpFallbackScreens]?: React.ReactNode;
};

export type SignupWithEmailOTPScreens = {
  [key in ScreenNames]?: React.FC;
};
