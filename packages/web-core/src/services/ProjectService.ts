import type { IProjectConfig } from "../types";
import type { ApiService } from "./ApiService";

/**
 * ProjectService is responsible for managing the project configuration.
 */
export class ProjectService {
  // Private property to hold the project configuration.
  #projConfig: IProjectConfig | null = null;
  // Private property to hold the instance of ApiService.
  #apiService: ApiService;

  /**
   * Constructs the ProjectService with the necessary ApiService.
   * @param apiService An instance of ApiService to be used for HTTP requests.
   */
  constructor(apiService: ApiService) {
    this.#apiService = apiService;
  }

  /**
   * Getter method for retrieving the current project configuration.
   * @returns The current project configuration or null if it's not set.
   */
  public get projConfig() {
    return this.#projConfig;
  }

  /**
   * Asynchronously fetches the project configuration using the ApiService.
   * @returns A Promise that resolves to the fetched project configuration.
   */
  public async getProjectConfig() {
    const resp = await this.#apiService.projectsApi.projectConfig();
    const config = resp.data.data;
    this.#projConfig = config;
    return this.#projConfig;
  }
}
