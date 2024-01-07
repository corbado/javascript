import type { CorbadoAppParams } from '@corbado/types';
import { Subject } from 'rxjs';

import { defaultTimeout, NonRecoverableError } from '../utils';
import { ApiService } from './ApiService';
import { AuthService } from './AuthService';
import { ProjectService } from './ProjectService';
import { SessionService } from './SessionService';
import { WebAuthnService } from './WebAuthnService';

export type { ProjectService } from './ProjectService';
export type { AuthService } from './AuthService';
export type { SessionService } from './SessionService';

/**
 * CorbadoApp is a class that represents the main application.
 * It manages the services and the flow of the application.
 * It also handles the initialization and destruction of the application.
 */
export class CorbadoApp {
  #apiService: ApiService;
  #authService: AuthService;
  #projectService: ProjectService;
  #projectId: string;
  #globalErrors: Subject<NonRecoverableError | undefined> = new Subject();
  #initialized = false;

  /**
   * The constructor initializes the services and sets up the application.
   */
  constructor(corbadoParams: CorbadoAppParams) {
    const { projectId, apiTimeout = defaultTimeout } = corbadoParams;
    this.#projectId = projectId;
    this.#apiService = new ApiService(this.#globalErrors, this.#projectId, apiTimeout);
    const sessionService = new SessionService(this.#apiService);
    const authenticatorService = new WebAuthnService(this.#globalErrors);
    this.#authService = new AuthService(this.#apiService, sessionService, authenticatorService);
    this.#projectService = new ProjectService(this.#apiService);
  }

  public get apiService() {
    return this.#apiService;
  }

  public get authService() {
    return this.#authService;
  }

  public get projectService() {
    return this.#projectService;
  }

  public get globalErrors() {
    return this.#globalErrors.asObservable();
  }

  public get initialized() {
    return this.#initialized;
  }

  /**
   * Method to initialize the application.
   * It fetches the project configuration and initializes the services.
   */
  public init() {
    if (this.#initialized) {
      return;
    }

    if (!this.#validateProjectId(this.#projectId)) {
      this.#globalErrors.next(NonRecoverableError.invalidConfig('Invalid project ID'));
    }

    this.#authService.init(true);
    this.#initialized = true;
  }

  #validateProjectId(projectId: string): boolean {
    if (!projectId.match(/^pro-\d+$/)) {
      return false;
    }

    return true;
  }
}
