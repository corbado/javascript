export enum ScreenNames {
  InitSignup,
  InitLogin,
  PasskeyAppend1,
  PasskeyAppend2,
  PasskeyAppended,
  PasskeyError,
  EmailOtpSignup,
  EmailOtpLogin,
  EmailLinkSentSignup,
  EmailLinkSentLogin,
  EmailLinkSuccessSignup,
  EmailLinkSuccessLogin,
  EmailEdit,
  PhoneOtpSignup,
  PhoneOtpLogin,
  PhoneEdit,
  PasskeyBackground,
  End,
  AbortSignup,
}

export enum OtpType {
  Email = '150919',
  Phone = '481926',
  Incomplete = '15091',
  Incorrect = '150918',
}

export enum IdentifierType {
  Email = 'email',
  Phone = 'phone',
  Social = 'social',
  Username = 'username',
}

export enum IdentifierEnforceVerification {
  None = 'none',
  Signup = 'signup',
  AtFirstLogin = 'at_first_login',
}

export enum IdentifierVerification {
  EmailOtp = 'email-otp',
  EmailLink = 'email-link',
  PhoneOtp = 'phone-otp',
}

export enum AuthType {
  Signup = 1,
  Login = 0,
}

export const emailLinkUrlToken = 'UaTwjBJwyDLMGVbR7WHh';

export const operationTimeout = process.env.CI ? 3000 : 5000;
export const totalTimeout = process.env.CI ? 15000 : 30000;
export const waitAfterLoad = 600; // timeout to reduce flakiness due to repetitive reloads
