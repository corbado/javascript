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
  UserNotFound,
  DeniedByPartialRollout,
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
  CboApiNotAvailablePreAuthenticator,
  CboApiNotAvailablePostAuthenticator,
  ClientPasskeyOperationCancelled,
  ClientExcludeCredentialsMatch,
}

export const getLoginErrorMessage = (code: LoginSituationCode): string | null => {
  switch (code) {
    case LoginSituationCode.CboApiNotAvailablePostAuthenticator:
    case LoginSituationCode.CboApiNotAvailablePostConditionalAuthenticator:
    case LoginSituationCode.CtApiNotAvailablePostAuthenticator:
    case LoginSituationCode.ClientPasskeyOperationCancelledTooManyTimes:
      return 'Passkey login failed unexpectedly. Please use your password to log in.';

    case LoginSituationCode.PasskeyNotAvailablePostConditionalAuthenticator:
      return 'This passkey has been deleted and can no longer be used. Please use your password to log in and create a new one.';

    case LoginSituationCode.UserNotFound:
      return 'There is no account registered with this email.';

    default:
      return null;
  }
};

export const getAppendErrorMessage = (code: AppendSituationCode): string | null => {
  switch (code) {
    case AppendSituationCode.ClientPasskeyOperationCancelled:
      return 'Passkey operation was cancelled or timed out. Please try again.';
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
      return 'Passkey operation was cancelled or timed out. Please try again.';
    default:
      return null;
  }
};
