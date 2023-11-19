import type {IFlowHandlerConfig} from "../types";
import type {SignUpFlowNames} from "../utils";
import {defaultTimeout, LoginFlowNames,} from "../utils";
import {ApiService} from "./ApiService";
import {AuthService} from "./AuthService";
import {FlowHandlerService} from "./FlowHandler";
import {ProjectService} from "./ProjectService";
import {SessionService} from "./SessionService";

export type { FlowHandlerService } from "./FlowHandler";
export type { ProjectService } from "./ProjectService";
export type { AuthService } from "./AuthService";
export type { SessionService } from "./SessionService";

export interface ICorbadoAppParams extends Partial<IFlowHandlerConfig> {
  projectId: string;
  apiTimeout?: number;
  defaultToLogin?: boolean;
  signupFlowName?: SignUpFlowNames;
  loginFlowName?: LoginFlowNames;
}

/**
 * CorbadoApp is a class that represents the main application.
 * It manages the services and the flow of the application.
 * It also handles the initialization and destruction of the application.
 */
export class CorbadoApp {
  #apiService: ApiService;
  #flowHandlerService: FlowHandlerService | null = null;
  #authService: AuthService;
  #projectService: ProjectService;
  #projectId: string;
  #onInitCallbacks: Array<(app: CorbadoApp) => void> = [];

  /**
   * The constructor initializes the services and sets up the application.
   */
  constructor(corbadoParams: ICorbadoAppParams) {
    const { projectId, apiTimeout = defaultTimeout } = corbadoParams;
    this.#projectId = projectId;
    this.#apiService = new ApiService(this.#projectId, apiTimeout);
    const sessionService = new SessionService(this.#apiService);
    this.#authService = new AuthService(this.#apiService, sessionService);
    this.#projectService = new ProjectService(this.#apiService);

    // void this.init(corbadoParams);
  }

  public get apiService() {
    return this.#apiService;
  }

  public get flowHandlerService() {
    return this.#flowHandlerService;
  }

  public get authService() {
    return this.#authService;
  }

  public get projectService() {
    return this.#projectService;
  }

  /**
   * Method to add a callback function to be called when the application is initialized.
   */
  public onInit(cb: (app: CorbadoApp) => void) {
    this.#onInitCallbacks.push(cb);
  }

  /**
   * Method to initialize the application.
   * It fetches the project configuration and sets up the flow handler service.
   */
  public init() {
    this.#authService.init()
  }

  /**
   * Method to destroy the application.
   * It calls the destroy method of the AuthService.
   */
  public destroy() {
    this.#authService.destroy();
  }
}
