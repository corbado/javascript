import type { ErrorRspAllOfError } from '../api';

export class CorbadoError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CorbadoError';
  }

  static fromApiResponse(errorResp: ErrorRspAllOfError): CorbadoError {
    console.log('errorResp', errorResp);
    switch (errorResp.type) {
      case 'validation_error': {
        if (!errorResp.validation?.length) {
          return NonRecoverableError.unknownError();
        }

        // we only care about the first error
        const firstError = errorResp.validation[0];
        if (firstError.field === 'username' && firstError.message === 'user already exists') {
          return new UserAlreadyExistsError();
        }

        if (firstError.field === 'username' && firstError.message === 'cannot be blank') {
          return new InvalidUserInputError('Field cannot be blank', 'username');
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
    }

    return NonRecoverableError.unknownError();
  }

  static fromDOMException(e: DOMException): CorbadoError {
    console.log(e.name);
    console.log(e);
    switch (e.name) {
      case 'NotAllowedError':
        return new PasskeyChallengeCancelledError();
      case 'SecurityError':
        return new NonRecoverableError(
          'server',
          'The relying party ID is not a registrable domain suffix of, nor equal to the current domain.',
          'Check your configuration for the relying party ID in Corbado\'s developer panel. This ID must be set to a value that matches your frontend\'s domain.',
          'https://docs.corbado.com',
        );
      default:
        return NonRecoverableError.unknownError();
    }
  }

  static fromUnknownException(e: unknown): CorbadoError {
    console.log('unknown exception', e);
    return NonRecoverableError.unknownError();
  }

  static illegalState(message: string): CorbadoError {
    return new IllegalStateError(message);
  }

  static noPasskeyAvailable(): CorbadoError {
    return new NoPasskeyAvailableError();
  }
}

export class NonRecoverableError extends CorbadoError {
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
    return new NonRecoverableError('server', 'An unknown error occurred', 'Contact the Corbado team', 'https://docs.corbado.com');
  }

  static invalidConfig(message: string) {
    return new NonRecoverableError('client', message, 'Check your parameters for <CorbadoProvider/>','https://docs.corbado.com');
  }
}

export class UserAlreadyExistsError extends CorbadoError {
  constructor() {
    super('User already exists');
    this.name = 'UserAlreadyExistsError';
  }
}

export class UnknownUserError extends CorbadoError {
  constructor() {
    super('User does not exist');
    this.name = 'UnknownUserError';
  }
}

export class NoPasskeyAvailableError extends CorbadoError {
  constructor() {
    super('No passkey available');
    this.name = 'NoPasskeyAvailableError';
  }
}

export class InvalidPasskeyError extends CorbadoError {
  constructor() {
    super('The provided passkey is no longer valid.');
    this.name = 'InvalidPasskeyError';
  }
}

export class PasskeyChallengeCancelledError extends CorbadoError {
  constructor() {
    super('Passkey challenge cancelled');
    this.name = 'PasskeyChallengeCancelledError';
  }
}

export class InvalidUserInputError extends CorbadoError {
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
export class IllegalStateError extends CorbadoError {
  constructor(message: string) {
    super(message);
    this.name = 'IllegalStateError';
  }
}
