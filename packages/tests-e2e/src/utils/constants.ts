export enum ScreenNames {
  Start,
  EnterOtp,
  PasskeyCreate,
  PasskeyBenefits,
  PasskeyAppend,
  PasskeySuccess,
  End,
}

export enum OtpType {
  Correct = '150919',
  Incomplete = '15091',
  Incorrect = '150918',
}

export const waitAfterLoad = 200; // remove after repetitive refreshing is fixed
