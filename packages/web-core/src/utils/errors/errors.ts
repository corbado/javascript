import log from 'loglevel';

import type { ErrorRspAllOfError } from '../../api';

export type SignUpWithPasskeyError =
  | UserAlreadyExistsError
  | InvalidUserInputError
  | PasskeyChallengeCancelledError
  | UnknownError;
export type AppendPasskeyError = PasskeyChallengeCancelledError | UnknownError;
export type LoginWithPasskeyError =
  | InvalidUserInputError
  | InvalidPasskeyError
  | PasskeyChallengeCancelledError
  | UnknownError;
export type InitAutocompletedLoginWithPasskeyError = UnknownError;
export type CompleteAutocompletedLoginWithPasskeyError =
  | InvalidPasskeyError
  | PasskeyChallengeCancelledError
  | UnknownError;
export type InitSignUpWithEmailOTPError = InvalidUserInputError | UserAlreadyExistsError | UnknownError;
export type CompleteSignupWithEmailOTPError = InvalidUserInputError | UnknownError;
export type InitLoginWithEmailOTPError = InvalidUserInputError | UnknownError;
export type CompleteLoginWithEmailOTPError = InvalidUserInputError | UnknownError;
export type AuthMethodsListError = UnknownUserError | UnknownError;

export class CorbadoError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CorbadoError';
  }

  static fromApiResponse(errorResp: ErrorRspAllOfError): CorbadoError {
    log.debug('errorResp', errorResp);
    switch (errorResp.type) {
      case 'validation_error': {
        if (!errorResp.validation?.length) {
          return CorbadoError.unknown();
        }

        // we only care about the first error
        const firstError = errorResp.validation[0];

        if (firstError.field === 'username') {
          switch (firstError.message) {
            case 'user already exists':
              return new UserAlreadyExistsError();
            case 'cannot be blank':
              return new InvalidUserInputError('Field cannot be blank', 'username');
            case "user doesn't exist":
              return new UnknownUserError();
          }
        }

        break;
      }
      case 'not_found':
        if (errorResp.details === "user doesn't exist") {
          return new UnknownUserError();
        }

        if (errorResp.details === 'Used invalid credentials') {
          return new InvalidPasskeyError();
        }

        if (errorResp.details === 'Email code not valid') {
          return new InvalidOtpInputError();
        }
    }

    return CorbadoError.unknown();
  }

  static fromDOMException(e: DOMException): CorbadoError | NonRecoverableError {
    switch (e.name) {
      case 'NotAllowedError':
        return new PasskeyChallengeCancelledError();
      case 'SecurityError':
        return new NonRecoverableError(
          'server',
          'The relying party ID is not a registrable domain suffix of, nor equal to the current domain.',
          "Check your configuration for the relying party ID in Corbado's developer panel. This ID must be set to a value that matches your frontend's domain.",
          'https://docs.corbado.com',
        );
      default:
        return CorbadoError.unknown();
    }
  }

  static fromUnknownException(e: unknown): CorbadoError {
    log.debug('unknown exception', e);
    return CorbadoError.unknown();
  }

  static illegalState(message: string): CorbadoError {
    return new IllegalStateError(message);
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
    super(message);
    this.name = 'RecoverableError';
  }
}

/**
 * NonRecoverableErrors are only thrown when there is a big problem with the application (e.g. the application is misconfigured).
 * We can not recover from such an error.
 * Therefore, these errors are handled by showing a central error page.
 * Only a few errors should fall into this category.
 */
export class NonRecoverableError extends Error {
  readonly type: 'client' | 'server';
  readonly hint: string;
  readonly link: string;
  readonly requestId?: string;

  constructor(type: 'client' | 'server', message: string, hint: string, link: string, requestId?: string) {
    super(message);
    this.name = 'DeveloperNoticeError';
    this.hint = hint;
    this.type = type;
    this.link = link;
    this.requestId = requestId;
  }

  static unknownError() {
    return new NonRecoverableError(
      'server',
      'An unknown error occurred',
      'Contact the Corbado team',
      'https://docs.corbado.com',
    );
  }

  static invalidConfig(message: string) {
    return new NonRecoverableError(
      'client',
      message,
      'Check your parameters for <CorbadoProvider/>',
      'https://docs.corbado.com',
    );
  }
}

export class UserAlreadyExistsError extends RecoverableError {
  constructor() {
    super('User already exists');
    this.name = 'UserAlreadyExistsError';
  }
}

export class UnknownUserError extends RecoverableError {
  constructor() {
    super('User does not exist');
    this.name = 'UnknownUserError';
  }
}

export class NoPasskeyAvailableError extends RecoverableError {
  constructor() {
    super('No passkey available');
    this.name = 'NoPasskeyAvailableError';
  }
}

export class InvalidPasskeyError extends RecoverableError {
  constructor() {
    super('The provided passkey is no longer valid.');
    this.name = 'InvalidPasskeyError';
  }
}

export class PasskeyChallengeCancelledError extends RecoverableError {
  constructor() {
    super('Passkey challenge cancelled');
    this.name = 'PasskeyChallengeCancelledError';
  }
}

export class InvalidUserInputError extends RecoverableError {
  field: string;

  constructor(message: string, field: string) {
    super(message);
    this.name = 'InvalidUserInputError';
    this.field = field;
  }
}

/**
 * this error is thrown when the application is in an invalid state
 * (e.g. an email OTP challenge is verified, but that challenge has never been started)
 */
export class IllegalStateError extends RecoverableError {
  constructor(message: string) {
    super(message);
    this.name = 'IllegalStateError';
  }
}

export class InvalidOtpInputError extends RecoverableError {
  constructor() {
    super('The provided OTP is no longer valid');
    this.name = 'InvalidOtpInputError';
  }
}

export class UnknownError extends RecoverableError {
  constructor() {
    super('An unknown error occurred');
    this.name = 'UnknownError';
  }
}
