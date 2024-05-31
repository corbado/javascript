import type { LoginIdentifierType } from '@corbado/types';
import type { CorbadoError, LastIdentifier } from '@corbado/web-core';

import type { Block } from './blocks';
import type { ContinueOnOtherEnvReasons, ScreenNames } from './constants';

export type BlockDataSignupInit = {
  fullName: TextFieldWithError | null;
  email: TextFieldWithError | null;
  phone: TextFieldWithError | null;
  userName: TextFieldWithError | null;
  socialData: SocialData;
  error?: CorbadoError;
};

export type BlockDataLoginInit = {
  loginIdentifier: string;
  loginIdentifierError: string;
  lastIdentifier: LastIdentifier | undefined;
  conditionalUIChallenge: string | undefined;
  isPhoneFocused: boolean;
  emailEnabled: boolean;
  usernameEnabled: boolean;
  phoneEnabled: boolean;
  socialData: SocialData;
};

export type BlockDataPasskeyAppend = {
  availableFallbacks: PasskeyFallback[];
  canBeSkipped: boolean;
  userHandle: string;
  userHandleType: LoginIdentifierType;
  translatedError?: string;
  preferredFallbackOnError?: PasskeyFallback;
  autoSubmit: boolean;
};

export type BlockDataPasskeyVerify = {
  availableFallbacks: PasskeyFallback[];
  identifierValue: string;
  preferredFallbackOnError?: PasskeyFallback;
};

export type BlockDataPasskeyAppended = Record<string, never>;

export type BlockDataPasskeyAppendAfterHybrid = {
  translatedError?: string;
  passkeyIconSet: string;
};

export type BlockDataMissingFields = {
  phone: TextFieldWithError | null;
  userName: TextFieldWithError | null;
};

export type BlockDataEmailVerify = {
  email: string;
  verificationMethod: 'email-otp' | 'email-link';
  translatedError?: string;
  retryNotBefore?: number;
  isPostLoginVerification?: boolean;
};

export type BlockDataPhoneVerify = {
  phone: string;
  translatedError?: string;
  retryNotBefore?: number;
  isPostLoginVerification?: boolean;
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
  // icon: string;
  // url: string;
};

export type SocialData = {
  providers: SocialLogin[];
  oAuthUrl?: string;
  started: boolean;
  finished: boolean;
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
