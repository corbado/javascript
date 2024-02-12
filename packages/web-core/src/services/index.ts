import type { CorbadoAppParams } from '@corbado/types';
import { BehaviorSubject } from 'rxjs';

import type { GlobalError } from '../utils';
import { defaultTimeout, NonRecoverableError } from '../utils';
import { ApiService } from './ApiService';
import { AuthService } from './AuthService';
import { ProjectService } from './ProjectService';

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
  #isDevMode: boolean;
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
      isDevMode = false,
      setShortSessionCookie = false,
    } = corbadoParams;
    this.#projectId = projectId;
    this.#isDevMode = isDevMode;
    this.#apiService = new ApiService(this.#globalErrors, this.#projectId, apiTimeout, frontendApiUrl);
    this.#authService = new AuthService(this.#apiService, this.#globalErrors, setShortSessionCookie);
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

  public get globalErrors(): BehaviorSubject<NonRecoverableError | undefined> {
    return this.#globalErrors;
  }

  public get initialized() {
    return this.#initialized;
  }

  /**
   * Method to initialize the application.
   * It fetches the project configuration and initializes the services.
   */
  public async init() {
    if (this.#initialized) {
      return;
    }

    if (!this.#validateProjectId(this.#projectId)) {
      this.#globalErrors.next(NonRecoverableError.invalidConfig('Invalid project ID'));
      return;
    }

    /*
    // we will need to pass this projectConfig to AuthService (e.g. to make decisions whether to use CorbadoSessionManagement or not)
    const projectConfig = await this.#projectService.getProjectConfig();
    if (projectConfig.err) {
      this.#globalErrors.next(NonRecoverableError.invalidConfig('Config could not be loaded'));
      return;
    }*/

    await this.#authService.init(this.#isDevMode);
    this.#initialized = true;
  }

  public dispose() {
    this.#authService.abortOngoingPasskeyOperation();
  }

  #validateProjectId(projectId: string): boolean {
    return /^pro-\d+$/.test(projectId);
  }

  /**
   * Method to clear the global errors.
   */
  clearGlobalErrors() {
    this.#globalErrors.next(undefined);
  }
}
