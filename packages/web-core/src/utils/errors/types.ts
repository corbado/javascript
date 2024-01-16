import type {
  InvalidEmailError,
  InvalidFullnameError,
  InvalidOtpInputError,
  InvalidPasskeyError,
  InvalidTokenInputError,
  PasskeyChallengeCancelledError,
  UnknownError,
  UnknownUserError,
  UserAlreadyExistsError,
} from './RecoverableErrors';

/** General Errors */
export type AuthMethodsListError = UnknownUserError | UnknownError;
export type GetProjectConfigError = UnknownError;

/** Passkey Authentication Errors */
export type SignUpWithPasskeyError =
  | UserAlreadyExistsError
  | InvalidEmailError
  | InvalidFullnameError
  | PasskeyChallengeCancelledError
  | UnknownError;
export type AppendPasskeyError = PasskeyChallengeCancelledError | UnknownError;
export type LoginWithPasskeyError =
  | InvalidEmailError
  | InvalidPasskeyError
  | PasskeyChallengeCancelledError
  | UnknownError;
export type InitAutocompletedLoginWithPasskeyError = UnknownError;
export type CompleteAutocompletedLoginWithPasskeyError =
  | InvalidPasskeyError
  | PasskeyChallengeCancelledError
  | UnknownError;

/** Email OTP Errors */
export type InitSignUpWithEmailOTPError = InvalidEmailError | UserAlreadyExistsError | UnknownError;
export type CompleteSignupWithEmailOTPError = InvalidOtpInputError | UnknownError;
export type InitLoginWithEmailOTPError = InvalidEmailError | UnknownError;
export type CompleteLoginWithEmailOTPError = InvalidOtpInputError | UnknownError;

/** Email Link Errors */
export type InitSignUpWithEmailLinkError = InvalidEmailError | UserAlreadyExistsError | UnknownError;
export type CompleteSignupWithEmailLinkError = InvalidTokenInputError | UnknownError;
export type InitLoginWithEmailLinkError = InvalidEmailError | UnknownError;
export type CompleteLoginWithEmailLinkError = InvalidTokenInputError | UnknownError;

/** Passkey Management Errors */
export type PasskeyListError = UnknownError;
export type PasskeyDeleteError = UnknownError;
