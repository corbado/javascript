import type { AxiosError } from 'axios';
import log from 'loglevel';

import type { ErrorRsp } from '../../api/v1';

/** General Errors */
export type GetProcessError = ProcessNotFound;

/** Passkey Management Errors */
export type PasskeyListError = UnknownError;
export type PasskeyDeleteError = UnknownError;

export class CorbadoError extends Error {
  #translatedMessage?: string;
  recoverable: boolean;
  ignore: boolean;

  constructor(recoverable: boolean, ignore: boolean) {
    super('An error has occurred');
    this.name = 'CorbadoError';
    this.recoverable = recoverable;
    this.ignore = ignore;
  }

  get translatedMessage(): string {
    if (!this.#translatedMessage) {
      // if the error can not be translated we show the untranslated message
      return this.message;
    }

    return this.#translatedMessage;
  }

  set translatedMessage(message: string) {
    this.#translatedMessage = message;
  }

  static missingInit(): CorbadoError {
    return new CorbadoError(false, false);
  }

  static invalidConfig(): CorbadoError {
    return new CorbadoError(false, false);
  }

  static ignore(): CorbadoError {
    return new CorbadoError(true, true);
  }

  static conditionalUINotSupported(): CorbadoError {
    return new CorbadoError(false, true);
  }

  static fromAxiosError(error: AxiosError): RecoverableError | NonRecoverableError {
    log.error('axios error', error);

    if (!error.response || !error.response.data) {
      return NonRecoverableError.unhandledBackendError('no_data_in_response');
    }

    const errorRespRaw = error.response.data as ErrorRsp;
    console.log('errorRespRaw', errorRespRaw.error.type);
    const errorResp = errorRespRaw.error;
    switch (errorResp.type) {
      case 'process_not_available':
        return new ProcessNotFound();
    }

    return NonRecoverableError.unhandledBackendError(errorResp.type);
  }

  static fromDOMException(e: DOMException): CorbadoError {
    console.log('e', e.name, e.message);
    switch (e.name) {
      case 'NotAllowedError':
      case 'AbortError':
        return new PasskeyChallengeCancelledError();
      case 'SecurityError':
        return new NonRecoverableError('SecurityError');
      default:
        log.warn('unhandled DOM exception', e.name, e.message);
        return new NonRecoverableError(e.message);
    }
  }

  static fromUnknownFrontendError(e: unknown): CorbadoError {
    if (e instanceof Error) {
      if (e.name === 'CanceledError') {
        return CorbadoError.ignore();
      }
    }

    return NonRecoverableError.unhandledFrontendError(`unknown ${e}`);
  }

  static noPasskeyAvailable(): CorbadoError {
    return new NoPasskeyAvailableError();
  }

  static onlyHybridPasskeyAvailable(): CorbadoError {
    return new OnlyHybridPasskeyAvailableError();
  }
}

/**
 * RecoverableError can be handled by either showing an error message to the user, by retrying the operation or by calling a fallback function.
 * Most errors fall into this category.
 */
export class RecoverableError extends CorbadoError {
  constructor(name: string) {
    super(true, false);
    this.name = name;
  }

  getTranslationKey() {
    return `errors.${this.name}`;
  }

  static unknown() {
    return new RecoverableError('unknown');
  }
}

/**
 * NonRecoverableErrors are only thrown when there is a big problem with the application (e.g. the application is misconfigured).
 * We can not recover from such an error.
 * Therefore, these errors are handled by showing a central error page.
 * Only a few errors should fall into this category.
 *
 * We don't offer translations for NonRecoverableError in general.
 * Only the generic version of the NonRecoverableError can be translated because it is intended to be shown to the end user.
 * The more detailed versions of NonRecoverableError are only shown to developers so there is no need to translate them.
 */
export class NonRecoverableError extends CorbadoError {
  readonly message: string;
  readonly link?: string;
  readonly requestId?: string;

  constructor(message: string, link?: string, requestId?: string) {
    super(false, false);
    this.message = message;
    this.link = link;
    this.requestId = requestId;
  }

  static unhandledFrontendError(message: string) {
    return new NonRecoverableError(`An error occurred in the frontend was not handled: ${message}`);
  }

  static unhandledBackendError(code: string, message?: string) {
    return new NonRecoverableError(`This error is not being handled by the frontend: ${message} (${code})`);
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

export class PasskeysNotSupported extends RecoverableError {
  constructor() {
    super('Passkeys are not supported for this device');
    this.name = 'errors.passkeysNotSupported';
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

export class OnlyHybridPasskeyAvailableError extends RecoverableError {
  constructor() {
    super('Only hybrid passkey available');
    this.name = 'errors.onlyHybridPasskeyAvailable';
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

export class ProcessNotFound extends RecoverableError {
  constructor() {
    super('processNotFound');
  }
}
