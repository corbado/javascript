export enum ScreenNames {
  InitSignup,
  InitLogin,
  InitLoginFallback,
  InitLoginOneTap,
  PasskeyAppend,
  PasskeyAppended,
  Home,
  PasskeyList,
  PasskeyError1,
  PasskeyError2,
}

export enum ErrorTexts {
  EmptyEmail = 'Enter your email address.',
  UnknownEmail = 'There is no account registered to that email address.',
  CancelledPasskey = 'You have cancelled setting up your passkey. Please try again.',
  PasskeyFetchFail = 'Unable to access passkeys. Check your connection and try again.',
  PasskeyCreateFail = 'Passkey creation failed. Please try again later.',
  PasskeyDeleteFail = 'Passkey deletion failed. Please try again later.',
  DeletedPasskeyUsed = 'You previously deleted this passkey. Use your password to log in instead.',
  PasskeySignatureValidationFail = 'We couldn\'t log you in with your passkey due to a system error. Use your password to log in instead.',
}

export const phone = '+4915121609839';
export const password = 'asdfasdf';

export const totalTimeout = process.env.CI ? 30000 : 40000;
export const operationTimeout = 10000;
