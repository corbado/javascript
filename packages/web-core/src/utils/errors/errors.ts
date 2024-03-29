import type { AxiosError } from 'axios';
import log from 'loglevel';
import type { BehaviorSubject } from 'rxjs';

import type { ErrorRsp } from '../../api';

/** General Errors */
export type AuthMethodsListError = UnknownUserError | UnknownError;
export type GetProjectConfigError = UnknownError;
export type GlobalError = BehaviorSubject<NonRecoverableError | undefined>;
export type SessionRefreshError = UnknownError;

/** Passkey Authentication Errors */
export type SignUpWithPasskeyError =
  | UserAlreadyExistsError
  | InvalidEmailError
  | InvalidFullnameError
  | PasskeyChallengeCancelledError
  | UnknownError;
export type AppendPasskeyError = PasskeyAlreadyExistsError | PasskeyChallengeCancelledError | UnknownError;
export type LoginWithPasskeyError =
  | InvalidEmailError
  | InvalidPasskeyError
  | PasskeyChallengeCancelledError
  | InitAutocompletedLoginWithPasskeyError
  | ConditionalUiNotSupportedError
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
export type UserExistsError = UnknownError;

export class CorbadoError extends Error {
  #translatedMessage?: string;
  recoverable: boolean;

  constructor(message: string, recoverable: boolean) {
    super(message);
    this.name = 'CorbadoError';
    this.recoverable = recoverable;
  }

  get translatedMessage(): string {
    if (!this.#translatedMessage) {
      throw new Error('error has not been translated.');
    }

    return this.#translatedMessage;
  }

  set translatedMessage(message: string) {
    this.#translatedMessage = message;
  }

  static fromAxiosError(error: AxiosError): RecoverableError | NonRecoverableError {
    log.debug('axios error', error);

    if (!error.response || !error.response.data) {
      return NonRecoverableError.unknown();
    }

    if (error.response.status >= 500 || error.response.status === 422) {
      try {
        const errorRespRaw = error.response.data as ErrorRsp;
        const message = errorRespRaw.error.details ?? error.message;
        return NonRecoverableError.server(
          message,
          errorRespRaw.requestData.requestID,
          errorRespRaw.error.links.pop() ?? '',
          errorRespRaw.error.type,
          errorRespRaw.requestData.link,
        );
      } catch (e) {
        return NonRecoverableError.server(error.message, '', '', '');
      }
    }

    if (error.response.status === 401) {
      return new UnAuthenticatedError();
    }

    const errorRespRaw = error.response.data as ErrorRsp;
    const errorResp = errorRespRaw.error;
    switch (errorResp.type) {
      case 'validation_error': {
        if (!errorResp.validation?.length) {
          return RecoverableError.unknown();
        }

        // we only care about the first error
        const firstError = errorResp.validation[0];

        if (firstError.field === 'username') {
          switch (firstError.message) {
            case 'user already exists':
              return new UserAlreadyExistsError();
            case 'cannot be blank':
              return new InvalidEmailError();
            case "user doesn't exist":
              return new UnknownUserError();
            case 'Invalid email address':
            case 'Invalid / unreachable email address':
              return new InvalidEmailError();
          }
        }

        if (firstError.field === 'sessionToken') {
          switch (firstError.message) {
            case 'user already exists':
              return new PasskeyAlreadyExistsError();
          }
        }

        break;
      }
      case 'not_found': {
        if (errorResp.details === "user doesn't exist") {
          return new UnknownUserError();
        }

        if (errorResp.details === 'Used invalid credentials') {
          return new InvalidPasskeyError();
        }

        if (errorResp.details === 'Email code not valid') {
          return new InvalidOtpInputError();
        }

        if (errorResp.details === 'Email link not valid') {
          return new InvalidTokenInputError();
        }

        break;
      }
      case 'client_error': {
        if (errorResp.details === 'Unconfirmed credential') {
          return new ConditionalUiUnconfirmedCredential();
        }

        break;
      }
    }

    return NonRecoverableError.unknown();
  }

  static fromDOMException(e: DOMException): CorbadoError {
    switch (e.name) {
      case 'NotAllowedError':
      case 'AbortError':
        return new PasskeyChallengeCancelledError();
      case 'SecurityError':
        return new NonRecoverableError(
          'server',
          'The relying party ID is not a registrable domain suffix of, nor equal to the current domain.',
          'https://docs.corbado.com',
        );
      default:
        log.warn('unhandled DOM exception', e.name, e.message);
        return NonRecoverableError.client(e.message);
    }
  }

  static fromUnknownException(e: unknown): CorbadoError {
    log.debug('unknown exception', e);
    return NonRecoverableError.unknown();
  }

  static illegalState(message: string, link: string): CorbadoError {
    return NonRecoverableError.client(message, link);
  }

  static noPasskeyAvailable(): CorbadoError {
    return new NoPasskeyAvailableError();
  }

  static unknown(): CorbadoError {
    return new UnknownError();
  }
}

/**
 * RecoverableError can be handled by either showing an error message to the user, by retrying the operation or by calling a fallback function.
 * Most errors fall into this category.
 */
export class RecoverableError extends CorbadoError {
  constructor(message: string) {
    super(message, true);
    this.name = 'RecoverableError';
  }

  static unknown() {
    return new RecoverableError('An unknown error occurred');
  }
}

/**
 * NonRecoverableErrors are only thrown when there is a big problem with the application (e.g. the application is misconfigured).
 * We can not recover from such an error.
 * Therefore, these errors are handled by showing a central error page.
 * Only a few errors should fall into this category.
 */
export class NonRecoverableError extends CorbadoError {
  readonly type: 'client' | 'server';
  readonly link?: string;
  readonly details?: string;
  readonly detailedType?: string;
  readonly requestId?: string;

  constructor(
    type: 'client' | 'server',
    message: string,
    link?: string,
    details?: string,
    detailedType?: string,
    requestId?: string,
  ) {
    super(message, false);
    this.name = 'Integration error';
    this.type = type;
    this.link = link;
    this.details = details;
    this.detailedType = detailedType;
    this.requestId = requestId;
  }

  static unknown() {
    return new NonRecoverableError('server', 'An unknown error occurred', 'https://docs.corbado.com');
  }

  static invalidConfig(message: string) {
    // TODO: add link to docs
    return NonRecoverableError.client(message, 'https://docs.corbado.com');
  }

  static server(message: string, requestId: string, link: string, detailedType: string, details?: string) {
    return new NonRecoverableError('server', message, link, details, detailedType, requestId);
  }

  static client(message: string, link?: string) {
    return new NonRecoverableError('client', message, link);
  }

  static userRegistrationNotAllowed() {
    return new NonRecoverableError(
      'server',
      'User registration is not allowed for this project',
      'https://docs.corbado.com/overview/sign-up-and-login-with-passkeys/user-flow-configuration#id-2.-public-sign-ups',
    );
  }
}

export class UnAuthenticatedError extends RecoverableError {
  constructor() {
    super('Unauthenticated');
    this.name = 'errors.unauthenticated';
  }
}

export class UserAlreadyExistsError extends RecoverableError {
  constructor() {
    super('User already exists');
    this.name = 'errors.userAlreadyExists';
  }
}

export class PasskeyAlreadyExistsError extends RecoverableError {
  constructor() {
    super('Passkey for this device already exists');
    this.name = 'errors.passkeyAlreadyExists';
  }
}

export class UnknownUserError extends RecoverableError {
  constructor() {
    super('User does not exist');
    this.name = 'errors.unknownUser';
  }
}

export class NoPasskeyAvailableError extends RecoverableError {
  constructor() {
    super('No passkey available');
    this.name = 'errors.noPasskeyAvailable';
  }
}

export class InvalidPasskeyError extends RecoverableError {
  constructor() {
    super('The provided passkey is no longer valid.');
    this.name = 'errors.invalidPasskey';
  }
}

export class PasskeyChallengeCancelledError extends RecoverableError {
  constructor() {
    super('Passkey challenge cancelled');
    this.name = 'errors.passkeyChallengeCancelled';
  }
}

export class InvalidFullnameError extends RecoverableError {
  constructor() {
    super('Invalid fullName');
    this.name = 'errors.invalidFullname';
  }
}

export class InvalidEmailError extends RecoverableError {
  constructor() {
    super('Invalid email');
    this.name = 'errors.invalidName';
  }
}

export class InvalidOtpInputError extends RecoverableError {
  constructor() {
    super('The provided OTP is no longer valid');
    this.name = 'errors.invalidOtp';
  }
}

export class InvalidTokenInputError extends RecoverableError {
  constructor() {
    super('The provided token is not valid for user verification');
    this.name = 'errors.invalidToken';
  }
}

export class ConditionalUiNotSupportedError extends RecoverableError {
  constructor() {
    super('Conditional UI is not supported by your device');
    this.name = 'errors.noConditionalUiSupport';
  }
}

export class ConditionalUiUnconfirmedCredential extends RecoverableError {
  constructor() {
    super('Unconfirmed credential');
    this.name = 'errors.conditionalUiUnconfirmedCredential';
  }
}

export class UnknownError extends RecoverableError {
  constructor() {
    super('An unknown error occurred');
    this.name = 'errors.unknownError';
  }
}
