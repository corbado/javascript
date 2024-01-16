import { CorbadoError } from './CorbadoError';

/**
 * NonRecoverableErrors are only thrown when there is a big problem with the application (e.g. the application is misconfigured).
 * We can not recover from such an error.
 * Therefore, these errors are handled by showing a central error page.
 * Only a few errors should fall into this category.
 */
export class NonRecoverableError extends CorbadoError {
  readonly type: 'client' | 'server';
  readonly link: string;
  readonly details?: string;
  readonly detailedType?: string;
  readonly requestId?: string;

  constructor(
    type: 'client' | 'server',
    message: string,
    link: string,
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

  static client(message: string, link: string) {
    return new NonRecoverableError('client', message, link);
  }
}
