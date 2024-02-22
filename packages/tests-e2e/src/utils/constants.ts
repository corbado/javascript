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
  PasskeyAppend,
  PasskeyAppended,
  EmailOtp,
  EmailLinkSent,
  EmailLinkSuccess,
  EmailChange,
  PhoneOtp,
  PhoneChange,
  End,
}

export enum OtpType {
  Correct = '150919',
  Incomplete = '15091',
  Incorrect = '150918',
}

export const waitAfterLoad = 600; // timeout to reduce flakiness due to repetitive reloads
