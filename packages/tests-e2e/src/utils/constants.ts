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

export const waitAfterLoad = 100; // timeout after each page load reduces flakiness (increase if flakiness becomes a problem in the pipeline)
