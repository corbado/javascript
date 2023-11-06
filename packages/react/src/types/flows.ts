import type {
  EmailOtpSignupScreens,
  PasskeyLoginWithEmailOtpFallbackScreens,
  PasskeySignupWithEmailOtpFallbackScreens,
} from "@corbado/web-core";

export type EmailOTPSignupScreensList = {
  [K in EmailOtpSignupScreens]?: React.ReactNode;
};

export type PasskeySignupWithEmailOtpFallbackScreensList = {
  [K in PasskeySignupWithEmailOtpFallbackScreens]?: React.ReactNode;
};

export type PasskeyLoginWithEmailOtpFallbackScreensList = {
  [K in PasskeyLoginWithEmailOtpFallbackScreens]?: React.ReactNode;
};
