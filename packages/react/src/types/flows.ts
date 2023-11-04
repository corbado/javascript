import type {
  EmailOtpSignupScreens,
  PasskeyLoginWithEmailOtpFallbackScreens,
  PasskeysSignupWithEmailOtpFallbackScreens,
} from "@corbado/web-core";

export type EmailOTPSignupScreensList = {
  [K in EmailOtpSignupScreens]?: React.ReactNode;
};

export type PasskeySignupWithEmailOtpFallbackScreensList = {
  [K in PasskeysSignupWithEmailOtpFallbackScreens]?: React.ReactNode;
};

export type PasskeyLoginWithEmailOtpFallbackScreensList = {
  [K in PasskeyLoginWithEmailOtpFallbackScreens]?: React.ReactNode;
};
