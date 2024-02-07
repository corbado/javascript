import type { ProjectConfig } from '@corbado/types';
import type { Result } from 'ts-results';
import { Ok } from 'ts-results';

import type { GetProjectConfigError } from '../utils';
import type { ApiService } from './ApiService';

/**
 * ProjectService is responsible for managing the project configuration.
 */
export class ProjectService {
  #projConfig: ProjectConfig | null = null;
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
  get projConfig() {
    return this.#projConfig;
  }

  /**
   * Asynchronously fetches the project configuration using the ApiService.
   * @returns A Promise that resolves to the fetched project configuration.
   */
  async getProjectConfig(forceRefresh = false): Promise<Result<ProjectConfig, GetProjectConfigError | undefined>> {
    if (this.#projConfig && !forceRefresh) {
      return Ok(this.#projConfig);
    }

    const projConfig = await this.#apiService.getProjectConfig();

    if (projConfig.ok) {
      this.#projConfig = projConfig.val;
      return Ok(this.#projConfig);
    }

    return projConfig;
  }
}
