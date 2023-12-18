import type { ProjectConfig, UserAuthMethods } from '@corbado/types';
import type { AxiosError, AxiosInstance } from 'axios';
import axios from 'axios';
import type { Subject } from 'rxjs';
import { Err, Result } from 'ts-results';

import { AssetsApi, Configuration, ProjectsApi, SessionsApi, UsersApi } from '../api';
import { AuthenticationResponse } from '../models/auth';
import type {
  AppendPasskeyError,
  AuthMethodsListError,
  CompleteLoginWithEmailOTPError,
  CompleteSignupWithEmailOTPError,
  GetProjectConfigError,
  InitAutocompletedLoginWithPasskeyError,
  InitLoginWithEmailOTPError,
  InitSignUpWithEmailOTPError,
  LoginWithPasskeyError,
  SignUpWithPasskeyError,
} from '../utils';
import { CorbadoError, NonRecoverableError } from '../utils';
import log from "loglevel";

// TODO: does this work also without npm start? (e.g. vite js)
const packageVersion = '0';

/**
 * ApiService class encapsulates API handling for the Corbado Application.
 * It manages API instances for users, assets, projects, and sessions, and configures them with
 * authentication tokens and default settings such as timeout and headers.
 * ApiService should completely abstract away the API layer from the rest of the application.
 */
export class ApiService {
  // Private API instances for various services.
  #usersApi: UsersApi = new UsersApi();
  #assetsApi: AssetsApi = new AssetsApi();
  #projectsApi: ProjectsApi = new ProjectsApi();
  #sessionsApi: SessionsApi = new SessionsApi();
  #globalErrors: Subject<NonRecoverableError | undefined>;

  // Private fields for project ID and default timeout for API calls.
  #projectId: string;
  #timeout: number;

  /**
   * Constructs the ApiService with a project ID and an optional timeout.
   * It initializes the API instances with a short term session token, if available.
   * @param projectId The project ID for the current application instance.
   * @param timeout Optional timeout for API requests, defaulting to 30 seconds.
   */
  constructor(globalErrors: Subject<NonRecoverableError | undefined>, projectId: string, timeout: number = 30 * 1000) {
    this.#globalErrors = globalErrors;
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

  public passKeyRegisterStart(
    email: string,
    username: string,
  ): Promise<Result<string, SignUpWithPasskeyError | undefined>> {
    return Result.wrapAsync(async () => {
      const r = await this.usersApi.passKeyRegisterStart({
        username: email,
        fullName: username,
      });

      return r.data.data.challenge;
    });
  }

  public passKeyRegisterFinish(
    signedChallenge: string,
  ): Promise<Result<AuthenticationResponse, SignUpWithPasskeyError | undefined>> {
    return Result.wrapAsync(async () => {
      const r = await this.usersApi.passKeyRegisterFinish({
        signedChallenge: signedChallenge,
      });

      return AuthenticationResponse.fromApiAuthenticationRsp(r.data.data);
    });
  }

  public passKeyAppendStart(): Promise<Result<string, AppendPasskeyError | undefined>> {
    return Result.wrapAsync(async () => {
      const r = await this.usersApi.passKeyAppendStart({});

      return r.data.data.challenge;
    });
  }

  public passKeyAppendFinish(signedChallenge: string): Promise<Result<void, AppendPasskeyError | undefined>> {
    return Result.wrapAsync(async () => {
      await this.usersApi.passKeyAppendFinish({
        signedChallenge: signedChallenge,
      });

      return void 0;
    });
  }

  public passKeyLoginStart(email: string): Promise<Result<string, LoginWithPasskeyError | undefined>> {
    return Result.wrapAsync(async () => {
      const r = await this.usersApi.passKeyLoginStart({
        username: email,
      });

      if (r.data.data.challenge === '') {
        return Promise.reject(CorbadoError.noPasskeyAvailable());
      }

      return r.data.data.challenge;
    });
  }

  public passKeyLoginFinish(
    signedChallenge: string,
  ): Promise<Result<AuthenticationResponse, LoginWithPasskeyError | undefined>> {
    return Result.wrapAsync(async () => {
      const r = await this.usersApi.passKeyLoginFinish({
        signedChallenge: signedChallenge,
      });

      return AuthenticationResponse.fromApiAuthenticationRsp(r.data.data);
    });
  }

  public passKeyMediationStart(): Promise<Result<string, InitAutocompletedLoginWithPasskeyError | undefined>> {
    return Result.wrapAsync(async () => {
      const r = await this.usersApi.passKeyMediationStart({
        username: '',
      });

      return r.data.data.challenge;
    });
  }

  public emailCodeRegisterStart(
    email: string,
    username: string,
  ): Promise<Result<string, InitSignUpWithEmailOTPError | undefined>> {
    return Result.wrapAsync(async () => {
      const r = await this.usersApi.emailCodeRegisterStart({
        email: email,
        username: username,
      });

      return r.data.data.emailCodeID;
    });
  }

  public emailCodeLoginStart(email: string): Promise<Result<string, InitLoginWithEmailOTPError | undefined>> {
    return Result.wrapAsync(async () => {
      const r = await this.usersApi.emailCodeLoginStart({
        username: email,
      });

      return r.data.data.emailCodeID;
    });
  }

  public async emailCodeConfirm(
    emailCodeId: string,
    otpCode: string,
  ): Promise<
    Result<AuthenticationResponse, CompleteSignupWithEmailOTPError | CompleteLoginWithEmailOTPError | undefined>
  > {
    if (emailCodeId === '') {
      return Err(
        CorbadoError.illegalState(
          'email OTP challenge has not been started',
          '',
        ),
      );
    }

    return Result.wrapAsync(async () => {
      const r = await this.usersApi.emailCodeConfirm({
        emailCodeID: emailCodeId,
        code: otpCode,
      });

      return AuthenticationResponse.fromApiAuthenticationRsp(r.data.data);
    });
  }

  public async authMethodsList(email: string): Promise<Result<UserAuthMethods, AuthMethodsListError | undefined>> {
    return Result.wrapAsync(async () => {
      const r = await this.usersApi.authMethodsList({
        username: email,
      });

      return r.data.data;
    });
  }

  public async getProjectConfig(): Promise<Result<ProjectConfig, GetProjectConfigError | undefined>> {
    return Result.wrapAsync(async () => {
      const r = await this.projectsApi.projectConfig();

      return r.data.data;
    });
  }
}
