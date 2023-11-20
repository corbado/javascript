import type { AxiosInstance } from 'axios';
import axios from 'axios';

import { AssetsApi, Configuration, ProjectsApi, SessionsApi, UsersApi } from '../api';

// TODO: does this work also without npm start? (e.g. vite js)
const packageVersion = '0';

/**
 * ApiService class encapsulates API handling for the Corbado Application.
 * It manages API instances for users, assets, projects, and sessions, and configures them with
 * authentication tokens and default settings such as timeout and headers.
 */
export class ApiService {
  // Private API instances for various services.
  #usersApi: UsersApi = new UsersApi();
  #assetsApi: AssetsApi = new AssetsApi();
  #projectsApi: ProjectsApi = new ProjectsApi();
  #sessionsApi: SessionsApi = new SessionsApi();

  // Private fields for project ID and default timeout for API calls.
  #projectId: string;
  #timeout: number;

  /**
   * Constructs the ApiService with a project ID and an optional timeout.
   * It initializes the API instances with a short term session token, if available.
   * @param projectId The project ID for the current application instance.
   * @param timeout Optional timeout for API requests, defaulting to 30 seconds.
   */
  constructor(projectId: string, timeout: number = 30 * 1000) {
    this.#projectId = projectId;
    this.#timeout = timeout;

    // Initializes the API instances with no authentication token.
    // Authentication tokens are set in the SessionService.
    this.#setApis('');
  }

  // Public getters for the API instances.
  get usersApi(): UsersApi {
    return this.#usersApi;
  }

  get assetsApi(): AssetsApi {
    return this.#assetsApi;
  }

  get projectsApi(): ProjectsApi {
    return this.#projectsApi;
  }

  get sessionsApi(): SessionsApi {
    return this.#sessionsApi;
  }

  /**
   * Creates an Axios instance with common headers, including authorization if a token is provided.
   * @param token - The authentication token for API requests.
   * @returns The configured AxiosInstance object.
   */
  #createAxiosInstance(token: string): AxiosInstance {
    const headers = {
      'Content-Type': 'application/json',
      'X-Corbado-WC-Version': token ? `Bearer ${token}` : packageVersion, // Example default version
    };

    return axios.create({
      timeout: this.#timeout,
      withCredentials: true,
      headers: token ? { ...headers, Authorization: `Bearer ${token}` } : headers,
    });
  }

  /**
   * Sets up the API instances with the provided token and base path, reusing a common Axios instance.
   * @param token - The authentication token to be used for API requests.
   */
  #setApis(token: string): void {
    const basePath = `https://${this.#projectId}.frontendapi.corbado.io`;
    const config = new Configuration({
      apiKey: this.#projectId,
      basePath,
      accessToken: token,
    });
    const axiosInstance = this.#createAxiosInstance(token);

    this.#usersApi = new UsersApi(config, basePath, axiosInstance);
    this.#assetsApi = new AssetsApi(config, basePath, axiosInstance);
    this.#projectsApi = new ProjectsApi(config, basePath, axiosInstance);
    this.#sessionsApi = new SessionsApi(config, basePath, axiosInstance);
  }

  /**
   * Public method to update the API instances with a new authentication token.
   * @param token - The new authentication token.
   */
  public setInstanceWithToken(token: string): void {
    this.#setApis(token);
  }
}
