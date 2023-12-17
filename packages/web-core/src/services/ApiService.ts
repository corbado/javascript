import type { PassKeyList } from '@corbado/types';
import type { AxiosError, AxiosInstance } from 'axios';
import axios from 'axios';
import { Err, Result } from 'ts-results';

import type { ErrorRsp } from '../api';
import { AssetsApi, Configuration, ProjectsApi, SessionsApi, UsersApi } from '../api';
import { AuthenticationResponse } from '../models/auth';
import type {
  AppendPasskeyError,
  CompleteLoginWithEmailOTPError,
  CompleteSignupWithEmailOTPError,
  InitAutocompletedLoginWithPasskeyError,
  InitLoginWithEmailOTPError,
  InitSignUpWithEmailOTPError,
  LoginWithPasskeyError,
  PasskeyDeleteError,
  PasskeyListError,
  SignUpWithPasskeyError,
} from '../utils';
import { CorbadoError, NonRecoverableError } from '../utils';

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
        if (!error.response || !error.response.data) {
          return Promise.reject(NonRecoverableError.unknownError());
        }

        const errorResp = error.response.data as ErrorRsp;
        if (error.response.status === 400 || error.response.status === 404) {
          const e = CorbadoError.fromApiResponse(errorResp.error);
          return Promise.reject(e);
        }

        return Promise.reject(error);
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

  public passKeyRegisterStart(email: string, username: string): Promise<Result<string, SignUpWithPasskeyError>> {
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
  ): Promise<Result<AuthenticationResponse, SignUpWithPasskeyError>> {
    return Result.wrapAsync(async () => {
      const r = await this.usersApi.passKeyRegisterFinish({
        signedChallenge: signedChallenge,
      });

      return AuthenticationResponse.fromApiAuthenticationRsp(r.data.data);
    });
  }

  public passKeyAppendStart(): Promise<Result<string, AppendPasskeyError>> {
    return Result.wrapAsync(async () => {
      const r = await this.usersApi.passKeyAppendStart({});

      return r.data.data.challenge;
    });
  }

  public passKeyAppendFinish(signedChallenge: string): Promise<Result<void, AppendPasskeyError>> {
    return Result.wrapAsync(async () => {
      await this.usersApi.passKeyAppendFinish({
        signedChallenge: signedChallenge,
      });

      return void 0;
    });
  }

  public passKeyLoginStart(email: string): Promise<Result<string, LoginWithPasskeyError>> {
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

  public passKeyLoginFinish(signedChallenge: string): Promise<Result<AuthenticationResponse, LoginWithPasskeyError>> {
    return Result.wrapAsync(async () => {
      const r = await this.usersApi.passKeyLoginFinish({
        signedChallenge: signedChallenge,
      });

      return AuthenticationResponse.fromApiAuthenticationRsp(r.data.data);
    });
  }

  public passKeyMediationStart(): Promise<Result<string, InitAutocompletedLoginWithPasskeyError>> {
    return Result.wrapAsync(async () => {
      const r = await this.usersApi.passKeyMediationStart({
        username: '',
      });

      return r.data.data.challenge;
    });
  }

  public emailCodeRegisterStart(email: string, username: string): Promise<Result<string, InitSignUpWithEmailOTPError>> {
    return Result.wrapAsync(async () => {
      const r = await this.usersApi.emailCodeRegisterStart({
        email: email,
        username: username,
      });

      return r.data.data.emailCodeID;
    });
  }

  public emailCodeLoginStart(email: string): Promise<Result<string, InitLoginWithEmailOTPError>> {
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
  ): Promise<Result<AuthenticationResponse, CompleteSignupWithEmailOTPError | CompleteLoginWithEmailOTPError>> {
    if (emailCodeId === '') {
      return Err(CorbadoError.illegalState('email OTP challenge has not been started'));
    }

    return Result.wrapAsync(async () => {
      const r = await this.usersApi.emailCodeConfirm({
        emailCodeID: emailCodeId,
        code: otpCode,
      });

      return AuthenticationResponse.fromApiAuthenticationRsp(r.data.data);
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
}
