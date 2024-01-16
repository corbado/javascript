import type { AxiosError } from 'axios';
import log from 'loglevel';

import type { ErrorRsp } from '../../api';
import { NonRecoverableError } from './NonRecoverableErrors';
import {
  InvalidEmailError,
  InvalidOtpInputError,
  InvalidPasskeyError,
  NoPasskeyAvailableError,
  PasskeyAlreadyExistsError,
  PasskeyChallengeCancelledError,
  RecoverableError,
  UnknownError,
  UnknownUserError,
  UserAlreadyExistsError,
} from './RecoverableErrors';

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
        return NonRecoverableError.unknown();
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
