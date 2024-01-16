import { CorbadoError } from './CorbadoError';

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
    super('The provided token is no longer valid');
    this.name = 'errors.invalidToken';
  }
}

export class UnknownError extends RecoverableError {
  constructor() {
    super('An unknown error occurred');
    this.name = 'errors.unknownError';
  }
}
