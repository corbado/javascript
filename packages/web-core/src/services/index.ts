import type { CorbadoAppParams } from '@corbado/types';
import type { Result } from 'ts-results';
import { Err, Ok } from 'ts-results';

import type { CorbadoError } from '../utils';
import { defaultTimeout, NonRecoverableError } from '../utils';
import { ProcessService } from './ProcessService';
import { SessionService } from './SessionService';

export type { SessionService } from './SessionService';

/**
 * CorbadoApp is a class that represents the main application.
 * It manages the services and the flow of the application.
 * It also handles the initialization and destruction of the application.
 */
export class CorbadoApp {
  #authProcessService: ProcessService;
  #sessionService: SessionService;
  #projectId: string;

  /**
   * The constructor initializes the services and sets up the application.
   */
  constructor(corbadoParams: CorbadoAppParams) {
    const {
      projectId,
      apiTimeout = defaultTimeout,
      frontendApiUrlSuffix = 'frontendapi.corbado.io',
      setShortSessionCookie = false,
      isPreviewMode = false,
    } = corbadoParams;
    this.#projectId = projectId;
    this.#authProcessService = new ProcessService(this.#projectId, apiTimeout, isPreviewMode, frontendApiUrlSuffix);
    this.#sessionService = new SessionService(
      this.#projectId,
      setShortSessionCookie,
      isPreviewMode,
      frontendApiUrlSuffix,
    );
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
      return Err(new NonRecoverableError('Invalid project ID'));
    }

    await this.#sessionService.init();

    return Ok(void 0);
  }

  #validateProjectId(projectId: string): boolean {
    return /^pro-\d+$/.test(projectId);
  }
}
