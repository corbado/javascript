import type { Block } from './blocks';
import type { ContinueOnOtherEnvReasons, LoginIdentifierType, ScreenNames } from './constants';

export type BlockDataSignupInit = {
  fullName: TextFieldWithError | null;
  email: TextFieldWithError | null;
  phone: TextFieldWithError | null;
  userName: TextFieldWithError | null;
  socialLogins: SocialLogin[];
};

export type BlockDataLoginInit = {
  loginIdentifier: string;
  loginIdentifierError: string;
  conditionalUIChallenge: string | undefined;
  isPhoneFocused: boolean;

  emailEnabled: boolean;
  usernameEnabled: boolean;
  phoneEnabled: boolean;
};

export type BlockDataPasskeyAppend = {
  availableFallbacks: PasskeyFallback[];
  canBeSkipped: boolean;
  userHandle: string;
  userHandleType: LoginIdentifierType;
  translatedError?: string;
};

export type BlockDataPasskeyVerify = {
  availableFallbacks: PasskeyFallback[];
  identifierValue: string;
};

export type BlockDataPasskeyAppended = Record<string, never>;

export type BlockDataEmailVerify = {
  email: string;
  verificationMethod: 'email-otp' | 'email-link';
  translatedError?: string;
  retryNotBefore?: number;
};

export type BlockDataPhoneVerify = {
  phone: string;
  translatedError?: string;
  retryNotBefore?: number;
};

export type BlockDataContinueOnOtherEnv = {
  reason: ContinueOnOtherEnvReasons;
};

export type PasskeyFallback = {
  label: string;
  action: () => Promise<void>;
};

export type SocialLogin = {
  name: string;
  icon: string;
  url: string;
};

export type TextFieldWithError = {
  value: string;
  translatedError?: string;
};

export type LoginIdentifiers = {
  email?: string;
  phone?: string;
  userName?: string;
};

export type ScreenWithBlock = {
  screen: ScreenNames;
  block: Block<unknown>;
};
