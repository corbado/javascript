import type { Block } from './blocks/Block';
import type { ScreenNames } from './constants';

export type BlockDataSignupInit = {
  fullName: SignUpField | null;
  email: SignUpField | null;
  phone: SignUpField | null;
  userName: SignUpField | null;
  socialLogins: SocialLogin[];
};

export type BlockDataPasskeyAppend = {
  availableFallbacks: PasskeyFallback[];
  canBeSkipped: boolean;
  userHandle: string;
};

export type BlockDataPasskeyAppended = Record<string, never>;

export type BlockDataEmailVerify = {
  email: string;
  translatedError?: string;
  retryNotBefore?: number;
};

export type BlockDataPhoneVerify = {
  phone: string;
  translatedError?: string;
  retryNotBefore?: number;
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

export type SignUpField = {
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
