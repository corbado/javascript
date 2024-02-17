import type { PassKeyList, ProjectConfig, UserAuthMethods, UserIdentifier } from '@corbado/types';
import type { AxiosError, AxiosInstance } from 'axios';
import axios from 'axios';
import log from 'loglevel';
import type { Subject } from 'rxjs';
import { Result } from 'ts-results';

import { Configuration, ProjectsApi, SessionsApi, UsersApi } from '../api/v1';
import type {
  AuthMethodsListError,
  GetProjectConfigError,
  PasskeyDeleteError,
  PasskeyListError,
  UserExistsError,
} from '../utils';
import { CorbadoError, NonRecoverableError } from '../utils';

// TODO: set this version
const packageVersion = '0.0.0';

/**
 * ApiService class encapsulates API handling for the Corbado Application.
 * It manages API instances for users, projects, and sessions, and configures them with
 * authentication tokens and default settings such as timeout and headers.
 * ApiService should completely abstract away the API layer from the rest of the application.
 */
export class ApiService {
  // Private API instances for various services.
  #usersApi: UsersApi = new UsersApi();
  #projectsApi: ProjectsApi = new ProjectsApi();
  #sessionsApi: SessionsApi = new SessionsApi();
  #globalErrors: Subject<NonRecoverableError | undefined>;

  // Private fields for project ID and default timeout for API calls.
  #projectId: string;
  #timeout: number;
  #frontendApiUrl: string;

  /**
   * Constructs the ApiService with a project ID and an optional timeout.
   * It initializes the API instances with a short term session token, if available.
   * @param globalErrors Subscribe to this subject to receive global errors that can not be handled by the component)
   * @param projectId The project ID for the current application instance.
   * @param timeout Optional timeout for API requests, defaulting to 30 seconds.
   * @param frontendApiUrl Optional URL for the frontend API, defaulting to https://<projectId>.frontendapi.corbado.io.
   */
  constructor(
    globalErrors: Subject<NonRecoverableError | undefined>,
    projectId: string,
    timeout: number = 30 * 1000,
    frontendApiUrl?: string,
  ) {
    this.#globalErrors = globalErrors;
    this.#projectId = projectId;
    this.#timeout = timeout;
    this.#frontendApiUrl = frontendApiUrl || `https://${this.#projectId}.frontendapi.corbado.io`;

    // Initializes the API instances with no authentication token.
    // Authentication tokens are set in the SessionService.
    this.#setApisV1('');
  }

  // Public getters for the API instances.
  get usersApi(): UsersApi {
    return this.#usersApi;
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
    const corbadoVersion = {
      name: 'web-core',
      sdkVersion: packageVersion,
    };

    const headers = {
      'Content-Type': 'application/json',
      'X-Corbado-WC-Version': JSON.stringify(corbadoVersion), // Example default version
    };

    const out = axios.create({
      timeout: this.#timeout,
      withCredentials: true,
      headers: token ? { ...headers, Authorization: `Bearer ${token}` } : headers,
    });

    // We transform AxiosErrors into CorbadoErrors using axios interceptors.
    out.interceptors.response.use(
      response => {
        return response;
      },
      (error: AxiosError) => {
        const e = CorbadoError.fromAxiosError(error);
        log.warn('error', e);

        if (e instanceof NonRecoverableError) {
          this.#globalErrors.next(e);
          return Promise.reject();
        }

        return Promise.reject(e);
      },
    );

    return out;
  }

  /**
   * Sets up the API instances with the provided token and base path, reusing a common Axios instance.
   * @param token - The authentication token to be used for API requests.
   */
  #setApisV1(token: string): void {
    const config = new Configuration({
      apiKey: this.#projectId,
      basePath: this.#frontendApiUrl,
      accessToken: token,
    });
    const axiosInstance = this.#createAxiosInstance(token);

    this.#usersApi = new UsersApi(config, this.#frontendApiUrl, axiosInstance);
    this.#projectsApi = new ProjectsApi(config, this.#frontendApiUrl, axiosInstance);
    this.#sessionsApi = new SessionsApi(config, this.#frontendApiUrl, axiosInstance);
  }

  /**
   * Public method to update the API instances with a new authentication token.
   * @param token - The new authentication token.
   */
  public setInstanceWithToken(token: string): void {
    this.#setApisV1(token);
  }

  public async authMethodsList(email: string): Promise<Result<UserAuthMethods, AuthMethodsListError | undefined>> {
    return Result.wrapAsync(async () => {
      const r = await this.usersApi.authMethodsList({
        username: email,
      });

      return r.data.data;
    });
  }

  public async getProjectConfig(): Promise<Result<ProjectConfig, GetProjectConfigError>> {
    return Result.wrapAsync(async () => {
      const r = await this.projectsApi.projectConfig();

      return r.data.data;
    });
  }

  public async passkeyList(): Promise<Result<PassKeyList, PasskeyListError>> {
    return Result.wrapAsync(async () => {
      const r = await this.#usersApi.currentUserPassKeyGet();

      return r.data.data;
    });
  }

  public async passkeyDelete(passkeyId: string): Promise<Result<void, PasskeyDeleteError>> {
    return Result.wrapAsync(async () => {
      await this.#usersApi.currentUserPassKeyDelete(passkeyId);

      return void 0;
    });
  }

  public async userExists(
    userIdentifierType: UserIdentifier,
    identifier: string,
  ): Promise<Result<boolean, UserExistsError | undefined>> {
    return Result.wrapAsync(async () => {
      const r = await this.usersApi.userExists({
        loginIdentifierType: userIdentifierType,
        loginIdentifier: identifier,
      });

      return r.data.exists;
    });
  }
}
