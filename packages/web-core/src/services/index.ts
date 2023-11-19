import type {IFlowHandlerConfig} from "../types";
import {defaultTimeout,} from "../utils";
import {ApiService} from "./ApiService";
import {AuthService} from "./AuthService";
import {ProjectService} from "./ProjectService";
import {SessionService} from "./SessionService";
import {FlowHandlerService} from "./FlowHandlerService";

export type {ProjectService} from "./ProjectService";
export type {AuthService} from "./AuthService";
export type {SessionService} from "./SessionService";
export {FlowHandlerService} from "./FlowHandlerService";

export interface ICorbadoAppParams extends Partial<IFlowHandlerConfig> {
  projectId: string;
  apiTimeout?: number;
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

  /**
   * The constructor initializes the services and sets up the application.
   */
  constructor(corbadoParams: ICorbadoAppParams) {
    const {projectId, apiTimeout = defaultTimeout} = corbadoParams;
    this.#projectId = projectId;
    this.#apiService = new ApiService(this.#projectId, apiTimeout);
    const sessionService = new SessionService(this.#apiService);
    this.#authService = new AuthService(this.#apiService, sessionService);
    this.#projectService = new ProjectService(this.#apiService);
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
   * Method to initialize the application.
   * It fetches the project configuration and sets up the flow handler service.
   */
  public init() {
    this.#authService.init()
  }
}
