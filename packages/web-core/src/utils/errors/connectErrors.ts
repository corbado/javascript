import type { AxiosError } from 'axios';
import log from 'loglevel';

export enum ConnectErrorType {
  MissingInit,
  RequestTimeout,
  Cancel,
  InvalidState,
  SecurityError,
  ExcludeCredentialsMatch,
}

export class ConnectError {
  type: ConnectErrorType;
  message?: string;
  runtime?: number;

  constructor(type: ConnectErrorType, message?: string, runtime?: number) {
    this.type = type;
    this.message = message;
    this.runtime = runtime;
  }

  track(): string {
    let out = `type: ${this.type}`;
    if (this.message) {
      out += ` message: ${this.message}`;
    }

    if (this.runtime) {
      out += ` runtime: ${this.runtime}`;
    }

    return out;
  }

  static fromConnectAxiosError(error: AxiosError, durationMs: number): ConnectError {
    log.debug('axios error', error);

    if (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK') {
      return new ConnectError(ConnectErrorType.RequestTimeout, error.message, durationMs);
    }

    if (error.name === 'CanceledError') {
      return new ConnectError(ConnectErrorType.Cancel, error.message, durationMs);
    }

    if (!error.response || !error.response.data) {
      return new ConnectError(ConnectErrorType.InvalidState, error.message, durationMs);
    }

    return new ConnectError(ConnectErrorType.InvalidState, error.response.data as string, durationMs);
  }

  static fromFrontendError(e: unknown, runtime?: number): ConnectError {
    if (e instanceof ConnectError) {
      return e;
    }

    if (e instanceof DOMException) {
      switch (e.name) {
        case 'NotAllowedError':
        case 'AbortError':
          return new ConnectError(ConnectErrorType.Cancel, e.message, runtime);
        case 'SecurityError':
          return new ConnectError(ConnectErrorType.SecurityError, e.message, runtime);
        case 'InvalidStateError':
          return new ConnectError(ConnectErrorType.ExcludeCredentialsMatch, e.message, runtime);
        default:
          return new ConnectError(ConnectErrorType.InvalidState, e.message, runtime);
      }
    }

    if (e instanceof Error) {
      if (e.name === 'CanceledError') {
        return new ConnectError(ConnectErrorType.Cancel, e.message);
      }

      return new ConnectError(ConnectErrorType.InvalidState, e.message);
    }

    return new ConnectError(ConnectErrorType.InvalidState, `unknown ${e}`);
  }
}
