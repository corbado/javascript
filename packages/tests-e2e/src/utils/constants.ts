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
  EmailLinkSuccess,
  EmailEdit,
  PhoneOtpSignup,
  PhoneOtpLogin,
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

export const waitAfterLoad = 500; // timeout to reduce flakiness due to repetitive reloads
