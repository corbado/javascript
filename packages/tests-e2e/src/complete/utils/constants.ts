export enum ScreenNames {
  InitSignup,
  InitLogin,
  PasskeyAppend1,
  PasskeyAppend2,
  PasskeyAppended,
  PasskeyError,
  EmailOtpSignup,
  EmailOtpLogin,
  EmailOtpPostLogin,
  EmailLinkSentSignup,
  EmailLinkSentLogin,
  EmailLinkSentPostLogin,
  EmailLinkSuccessSignup,
  EmailLinkSuccessLogin,
  EmailEdit,
  PhoneOtpSignup,
  PhoneOtpLogin,
  PhoneOtpLoginPostLogin,
  PhoneEdit,
  PasskeyBackground,
  End,
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

export const totalTimeout = process.env.CI ? 30000 : 40000;
export const operationTimeout = process.env.CI ? 5000 : 7000;
export const socialTotalTimeout = 45000;
export const socialOperationTimeout = 10000;
export const waitAfterLoad = 600; // timeout to reduce flakiness due to repetitive reloads

export enum SocialProviderType {
  Microsoft = 'microsoft',
  Github = 'github',
  Google = 'google',
}
