// export enum ScreenNames {
//   Start,
//   EnterOtp,
//   PasskeyCreate,
//   PasskeyBenefits,
//   PasskeyAppend,
//   PasskeySuccess,
//   End,
// }

export enum ScreenNames {
  InitSignup,
  InitLogin,
  PasskeyAppend1,
  PasskeyAppend2,
  PasskeyAppended,
  PasskeyError,
  EmailOtp,
  EmailLinkSent,
  EmailLinkSuccess,
  EmailEdit,
  PhoneOtp,
  PhoneEdit,
  End,
}

export enum OtpType {
  Email = '150919',
  Sms = '481926',
  Incomplete = '15091',
  Incorrect = '150918',
}

export const waitAfterLoad = 600; // timeout to reduce flakiness due to repetitive reloads
