import type { CorbadoAppParams } from '@corbado/types';
import { BehaviorSubject } from 'rxjs';

import type { GlobalError } from '../utils';
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
  #globalErrors: GlobalError = new BehaviorSubject<NonRecoverableError | undefined>(undefined);
  #initialized = false;

  /**
   * The constructor initializes the services and sets up the application.
   */
  constructor(corbadoParams: CorbadoAppParams) {
    const {
      projectId,
      apiTimeout = defaultTimeout,
      frontendApiUrl,
      setShortSessionCookie = false,
      isPreviewMode = false,
    } = corbadoParams;
    this.#projectId = projectId;
    this.#authProcessService = new ProcessService(
      this.#globalErrors,
      this.#projectId,
      apiTimeout,
      isPreviewMode,
      frontendApiUrl,
    );
    this.#sessionService = new SessionService(
      this.#globalErrors,
      this.#projectId,
      setShortSessionCookie,
      isPreviewMode,
      frontendApiUrl,
    );
  }

  get authProcessService() {
    return this.#authProcessService;
  }

  get sessionService() {
    return this.#sessionService;
  }

  get globalErrors(): BehaviorSubject<NonRecoverableError | undefined> {
    return this.#globalErrors;
  }

  get initialized() {
    return this.#initialized;
  }

  /**
   * Method to initialize the application.
   * It fetches the project configuration and initializes the services.
   */
  async init() {
    if (this.#initialized) {
      return;
    }

    if (!this.#validateProjectId(this.#projectId)) {
      this.addGlobalError(new NonRecoverableError('Invalid project ID'));
      return;
    }

    await this.#sessionService.init();

    this.#initialized = true;
  }

  dispose() {
    this.#authProcessService.abortOngoingPasskeyOperation();
    this.#sessionService.abortOngoingPasskeyOperation();
  }

  #validateProjectId(projectId: string): boolean {
    return /^pro-\d+$/.test(projectId);
  }

  addGlobalError(error: NonRecoverableError | undefined) {
    this.#globalErrors.next(error);
  }

  /**
   * Method to clear the global errors.
   */
  clearGlobalErrors() {
    this.addGlobalError(undefined);
  }
}
