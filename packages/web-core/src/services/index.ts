import type { CorbadoAppParams } from '@corbado/types';
import type { Result } from 'ts-results';
import { Ok } from 'ts-results';

import type { CorbadoError } from '../utils';
import { defaultTimeout } from '../utils';
import { ProcessService } from './ProcessService';
import { SessionService } from './SessionService';

export type { SessionService } from './SessionService';
export { ConnectService } from './ConnectService';

/**
 * CorbadoApp is a class that represents the main application.
 * It manages the services and the flow of the application.
 * It also handles the initialization and destruction of the application.
 */
export class CorbadoApp {
  #authProcessService: ProcessService;
  #sessionService: SessionService;
  #projectId: string;
  #frontendApi: string;

  /**
   * The constructor initializes the services and sets up the application.
   */
  constructor(corbadoParams: CorbadoAppParams) {
    const { projectId, frontendApi, apiTimeout = defaultTimeout, isPreviewMode = false } = corbadoParams;

    this.#projectId = projectId;
    this.#frontendApi = frontendApi;
    this.#authProcessService = new ProcessService(this.#projectId, frontendApi, apiTimeout, isPreviewMode);
    this.#sessionService = new SessionService(this.#projectId, frontendApi, isPreviewMode);
  }

  get authProcessService() {
    return this.#authProcessService;
  }

  get sessionService() {
    return this.#sessionService;
  }

  /**
   * Method to initialize the application.
   * It fetches the project configuration and initializes the services.
   */
  async init(): Promise<Result<void, CorbadoError>> {
    if (!this.#validateProjectId(this.#projectId)) {
      throw new Error(`Invalid project ID '${this.#projectId}'`);
      // @todo Fix this
      //return Err(new NonRecoverableError(`Invalid project ID '${this.#projectId}'`));
    }

    const validationError = this.#validateFrontendApi(this.#frontendApi);
    if (validationError !== '') {
      throw new Error(validationError);
      // @todo Fix this
      //return Err(new NonRecoverableError(validationError));
    }

    await this.#sessionService.init();

    return Ok(void 0);
  }

  dispose() {
    this.#authProcessService.dispose();
    this.#sessionService.dispose();
  }

  #validateProjectId(projectId: string): boolean {
    return /^pro-\d+$/.test(projectId);
  }

  #validateFrontendApi(frontendApi: string): string {
    if (!frontendApi || frontendApi.trim() === '') {
      return 'String must not be empty';
    }

    let url: URL;
    try {
      url = new URL(frontendApi);
    } catch (err: any) {
      return `Failed to parse URL: ${err.message}`;
    }

    if (url.protocol !== 'https:') {
      const protocol = url.protocol.replace(':', '');

      return `Scheme needs to be 'https' in given value '${frontendApi}' (scheme: '${protocol}')`;
    }

    if (!url.hostname) {
      return `Host must not be empty in given value '${frontendApi}'`;
    }

    if (url.username) {
      return `Username must be empty in given value '${frontendApi}' (username: '${url.username}')`;
    }

    if (url.password) {
      return `Password must be empty in given value '${frontendApi}' (password: '${url.password}')`;
    }

    // We need to check for the trailing slash manually because URL class adds one by default if is
    // not there (see next pathname validation).
    if (frontendApi[frontendApi.length - 1] === '/') {
      return `Trailing slash is not allowed in given value '${frontendApi}'`;
    }

    if (url.pathname !== '' && url.pathname !== '/') {
      return `Path must be empty in given value '${frontendApi}' (path: '${url.pathname}')`;
    }

    if (url.hash !== '') {
      return `Fragment must be empty in given value '${frontendApi}' (fragment: '${url.hash}')`;
    }

    if (url.search !== '') {
      return `Querystring must be empty in given value '${frontendApi}' (querystring: '${url.search}')`;
    }

    return '';
  }
}
