export enum LoginSituationCode {
  CboApiNotAvailablePreConditionalAuthenticator,
  ClientPasskeyConditionalOperationCancelled,
  ClientPasskeyOperationCancelledTooManyTimes,
  PasskeyNotAvailablePostConditionalAuthenticator,
  CboApiNotAvailablePostConditionalAuthenticator,
  CboApiNotAvailablePreAuthenticator,
  ClientPasskeyOperationCancelled,
  CboApiNotAvailablePostAuthenticator,
  CtApiNotAvailablePostAuthenticator,
  ExplicitFallbackByUser,
  PreAuthenticatorUserNotFound,
  DeniedByPartialRollout,
  PreAuthenticatorCustomError,
  PreAuthenticatorExistingPasskeysNotAvailable,
}

export enum AppendSituationCode {
  CboApiNotAvailablePreAuthenticator,
  CboApiNotAvailablePostAuthenticator,
  CtApiNotAvailablePreAuthenticator,
  ClientPasskeyOperationCancelled,
  ClientExcludeCredentialsMatch,
  DeniedByPartialRollout,
  DeniedByPasskeyIntel,
  ExplicitSkipByUser,
}

export enum PasskeyListSituationCode {
  CboApiNotAvailableDuringInitialLoad,
  CtApiNotAvailableDuringInitialLoad,
  CboApiNotAvailableDuringDelete,
  CtApiNotAvailablePreDelete,
  CtApiNotAvailablePreAuthenticator,
  CboApiPasskeysNotSupported,
  CboApiNotAvailablePreAuthenticator,
  CboApiNotAvailablePostAuthenticator,
  ClientPasskeyOperationCancelled,
  ClientExcludeCredentialsMatch,
}

export type PreAuthenticatorCustomErrorData = {
  code: string;
  message: string;
};

export const getLoginErrorMessage = (code: LoginSituationCode): string | null => {
  switch (code) {
    case LoginSituationCode.CboApiNotAvailablePostAuthenticator:
    case LoginSituationCode.CboApiNotAvailablePostConditionalAuthenticator:
    case LoginSituationCode.CtApiNotAvailablePostAuthenticator:
    case LoginSituationCode.ClientPasskeyOperationCancelledTooManyTimes:
      return "We couldn't log you in with your passkey due to a system error. Use your password to log in instead.";

    case LoginSituationCode.PasskeyNotAvailablePostConditionalAuthenticator:
      return 'You previously deleted this passkey. Use your password to log in instead.';

    case LoginSituationCode.PreAuthenticatorUserNotFound:
      return 'There is no account registered to that email address.';

    default:
      return null;
  }
};

export const getAppendErrorMessage = (code: AppendSituationCode): string | null => {
  switch (code) {
    case AppendSituationCode.ClientPasskeyOperationCancelled:
      return 'You have cancelled setting up your passkey. Please try again.';
    default:
      return null;
  }
};

export const getPasskeyListErrorMessage = (code: PasskeyListSituationCode): string | null => {
  switch (code) {
    case PasskeyListSituationCode.CboApiNotAvailableDuringInitialLoad:
    case PasskeyListSituationCode.CtApiNotAvailableDuringInitialLoad:
      return 'Unable to access passkeys. Check your connection and try again.';
    case PasskeyListSituationCode.CboApiNotAvailableDuringDelete:
    case PasskeyListSituationCode.CtApiNotAvailablePreDelete:
      return 'Passkey deletion failed. Please try again later.';
    case PasskeyListSituationCode.CtApiNotAvailablePreAuthenticator:
    case PasskeyListSituationCode.CboApiNotAvailablePreAuthenticator:
    case PasskeyListSituationCode.CboApiNotAvailablePostAuthenticator:
      return 'Passkey creation failed. Please try again later.';
    case PasskeyListSituationCode.ClientPasskeyOperationCancelled:
      return 'You have cancelled setting up your passkey. Please try again.';
    default:
      return null;
  }
};
