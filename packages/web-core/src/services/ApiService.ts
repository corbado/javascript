import type { ProjectConfig, UserAuthMethods } from '@corbado/types';
import type { PassKeyList, UserIdentifier } from '@corbado/types';
import type { AxiosError, AxiosHeaders, AxiosInstance, HeadersDefaults, RawAxiosRequestHeaders } from 'axios';
import axios from 'axios';
import log from 'loglevel';
import type { Subject } from 'rxjs';
import { Err, Result } from 'ts-results';

import type { SessionRefreshRsp, ShortSession } from '../api';
import { AssetsApi, Configuration, ProjectsApi, SessionsApi, UsersApi } from '../api';
import { AuthenticationResponse } from '../models/auth';
import type {
  AppendPasskeyError,
  AuthMethodsListError,
  CompleteLoginWithEmailLinkError,
  CompleteLoginWithEmailOTPError,
  CompleteSignupWithEmailLinkError,
  CompleteSignupWithEmailOTPError,
  GetProjectConfigError,
  InitAutocompletedLoginWithPasskeyError,
  InitLoginWithEmailLinkError,
  InitLoginWithEmailOTPError,
  InitSignUpWithEmailLinkError,
  InitSignUpWithEmailOTPError,
  LoginWithPasskeyError,
  PasskeyDeleteError,
  PasskeyListError,
  SignUpWithPasskeyError,
  UserExistsError,
} from '../utils';
import { CorbadoError, NonRecoverableError } from '../utils';

// TODO: set this version
const packageVersion = '0.0.0';

/**
 * ApiService class encapsulates API handling for the Corbado Application.
 * It manages API instances for users, assets, projects, and sessions, and configures them with
 * authentication tokens and default settings such as timeout and headers.
 * ApiService should completely abstract away the API layer from the rest of the application.
 */
export class ApiService {
  // Private API instances for various services.
  #usersApi: UsersApi = new UsersApi();
  #usersApiWithAuth: UsersApi = new UsersApi();
  #assetsApi: AssetsApi = new AssetsApi();
  #projectsApi: ProjectsApi = new ProjectsApi();
  #sessionsApi: SessionsApi = new SessionsApi();
  #sessionsApiWithAuth: SessionsApi = new SessionsApi();
  #globalErrors: Subject<NonRecoverableError | undefined>;

  // Private fields for project ID and default timeout for API calls.
  #projectId: string;
  #timeout: number;
  #frontendApiUrl: string;
  #isPreviewMode: boolean;

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
    isPreviewMode: boolean,
    frontendApiUrl?: string,
  ) {
    this.#globalErrors = globalErrors;
    this.#projectId = projectId;
    this.#timeout = timeout;
    this.#frontendApiUrl = frontendApiUrl || `https://${this.#projectId}.frontendapi.corbado.io`;
    this.#isPreviewMode = isPreviewMode;

    // Initializes the API instances with no authentication token.
    // Authentication tokens are set in the SessionService.
    this.#setApis('');
  }

  // Public getters for the API instances.
  get usersApi(): UsersApi {
    return this.#usersApi;
  }

  get usersApiWithAuth(): UsersApi {
    return this.#usersApiWithAuth;
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

  get sessionsApiWithAuth(): SessionsApi {
    return this.#sessionsApiWithAuth;
  }

  /**
   * Transforms AxiosErrors into CorbadoErrors using axios interceptors.
   * @param instance - The Axios instance to add the interceptor to.
   */
  #addErrorInterceptor = (instance: AxiosInstance) => {
    instance.interceptors.response.use(
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
  };

  /**
   * Creates an Axios instance with common headers, including authorization if a token is provided.
   * @param token - The authentication token for API requests.
   * @returns The configured AxiosInstance object.
   */
  #createAxiosInstance(token: string): {
    instanceWithAuth: AxiosInstance;
    instanceWithoutAuth: AxiosInstance;
  } {
    const corbadoVersion = {
      name: 'web-core',
      sdkVersion: packageVersion,
    };

    const headers: RawAxiosRequestHeaders | AxiosHeaders | Partial<HeadersDefaults> = {
      'Content-Type': 'application/json',
      'X-Corbado-WC-Version': JSON.stringify(corbadoVersion), // Example default version
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      Expires: '0',
    };

    if (this.#isPreviewMode) {
      headers['X-Corbado-Mode'] = 'preview';
    }

    const instanceWithoutAuth = axios.create({
      timeout: this.#timeout,
      withCredentials: true,
      headers,
    });

    const instanceWithAuth = token
      ? axios.create({
          timeout: this.#timeout,
          withCredentials: true,
          headers: { ...headers, Authorization: `Bearer ${token}` },
        })
      : axios.create({
          timeout: this.#timeout,
          withCredentials: true,
          headers,
        });

    this.#addErrorInterceptor(instanceWithoutAuth);
    this.#addErrorInterceptor(instanceWithAuth);

    return {
      instanceWithAuth,
      instanceWithoutAuth,
    };
  }

  /**
   * Sets up the API instances with the provided token and base path, reusing a common Axios instance.
   * @param token - The authentication token to be used for API requests.
   */
  #setApis(token: string): void {
    const config = new Configuration({
      apiKey: this.#projectId,
      basePath: this.#frontendApiUrl,
      accessToken: token,
    });
    const { instanceWithoutAuth, instanceWithAuth } = this.#createAxiosInstance(token);

    this.#usersApi = new UsersApi(config, this.#frontendApiUrl, instanceWithoutAuth);
    this.#usersApiWithAuth = new UsersApi(config, this.#frontendApiUrl, instanceWithAuth);
    this.#assetsApi = new AssetsApi(config, this.#frontendApiUrl, instanceWithoutAuth);
    this.#projectsApi = new ProjectsApi(config, this.#frontendApiUrl, instanceWithoutAuth);
    this.#sessionsApi = new SessionsApi(config, this.#frontendApiUrl, instanceWithoutAuth);
    this.#sessionsApiWithAuth = new SessionsApi(config, this.#frontendApiUrl, instanceWithAuth);
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
      const r = await this.usersApiWithAuth.passKeyAppendStart({});

      return r.data.data.challenge;
    });
  }

  public passKeyAppendFinish(signedChallenge: string): Promise<Result<void, AppendPasskeyError | undefined>> {
    return Result.wrapAsync(async () => {
      await this.usersApiWithAuth.passKeyAppendFinish({
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
      return Err(CorbadoError.illegalState('email OTP challenge has not been started', ''));
    }

    return Result.wrapAsync(async () => {
      const r = await this.usersApi.emailCodeConfirm({
        emailCodeID: emailCodeId,
        code: otpCode,
      });

      return AuthenticationResponse.fromApiAuthenticationRsp(r.data.data);
    });
  }

  public emailLinkRegisterStart(
    email: string,
    username: string,
  ): Promise<Result<string, InitSignUpWithEmailLinkError | undefined>> {
    return Result.wrapAsync(async () => {
      const r = await this.usersApi.emailLinkRegisterStart({
        email: email,
        username: username,
      });

      return r.data.data.emailLinkID;
    });
  }

  public emailLinkLoginStart(email: string): Promise<Result<string, InitLoginWithEmailLinkError | undefined>> {
    return Result.wrapAsync(async () => {
      const r = await this.usersApi.emailLinkLoginStart({
        username: email,
      });

      return r.data.data.emailLinkID;
    });
  }

  public async emailLinkConfirm(
    emailLinkID: string,
    token: string,
  ): Promise<
    Result<AuthenticationResponse, CompleteSignupWithEmailLinkError | CompleteLoginWithEmailLinkError | undefined>
  > {
    if (emailLinkID === '') {
      return Err(CorbadoError.illegalState('email magic link challenge has not been started', ''));
    }

    return Result.wrapAsync(async () => {
      const r = await this.usersApi.emailLinkConfirm({
        emailLinkID: emailLinkID,
        token: token,
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

  public async getProjectConfig(): Promise<Result<ProjectConfig, GetProjectConfigError>> {
    return Result.wrapAsync(async () => {
      const r = await this.projectsApi.projectConfig();

      return r.data.data;
    });
  }

  public async passkeyList(): Promise<Result<PassKeyList, PasskeyListError>> {
    return Result.wrapAsync(async () => {
      const r = await this.usersApiWithAuth.currentUserPassKeyGet();

      return r.data.data;
    });
  }

  public async passkeyDelete(passkeyId: string): Promise<Result<void, PasskeyDeleteError>> {
    return Result.wrapAsync(async () => {
      await this.usersApiWithAuth.currentUserPassKeyDelete(passkeyId);

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

  public async sessionRefresh(): Promise<Result<SessionRefreshRsp | undefined, NonRecoverableError | undefined>> {
    return Result.wrapAsync(async () => {
      const response = await this.#sessionsApiWithAuth.sessionRefresh({});

      if (response.status !== 200) {
        log.warn(`refresh error, status code: ${response.status}`);
        return;
      }

      if (!response.data.shortSession?.value) {
        log.warn('refresh error, missing short session');
        return;
      }

      return response.data;
    });
  }

  public async logout(): Promise<Result<ShortSession | undefined, NonRecoverableError | undefined>> {
    return Result.wrapAsync(async () => {
      const response = await this.#sessionsApiWithAuth.sessionLogout({});

      if (response.status !== 200) {
        return;
      }

      return response.data.shortSession;
    });
  }
}
