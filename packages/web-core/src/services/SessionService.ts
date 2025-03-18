/// <reference types="user-agent-data-types" /> <- add this line
import type { CorbadoUser, PassKeyList, SessionUser } from '@corbado/types';
import type {
  AxiosHeaders,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  RawAxiosRequestHeaders,
} from 'axios';
import axios, { type AxiosError } from 'axios';
import log from 'loglevel';
import { BehaviorSubject } from 'rxjs';
import { Err, Ok, Result } from 'ts-results';

import { Configuration } from '../api/v1';
import type { SessionConfigRsp, SessionTokenCookieConfig } from '../api/v2';
import { ConfigsApi, UsersApi } from '../api/v2';
import { SessionToken } from '../models/sessionToken';
import {
  AuthState,
  base64decode,
  CorbadoError,
  PasskeyAlreadyExistsError,
  type PasskeyDeleteError,
  PasskeysNotSupported,
  SessionManagementNotEnabled,
} from '../utils';
import { ClientStateService } from './ClientStateService';
import { WebAuthnService } from './WebAuthnService';

const sessionTokenKey = 'cbo_session_token';
const refreshTokenKey = 'cbo_refresh_token';

// controls how long before the session-token expires we should refresh it
const sessionTokenRefreshBeforeExpirationSeconds = 60;
// controls how often we check if we need to refresh the session-token
const sessionTokenRefreshIntervalMs = 10_000;

const packageVersion = '0.0.0';

/**
 * The SessionService manages user sessions for the Corbado Application, handling session-token and refresh-token.
 * It offers methods to set, delete, and retrieve these tokens and the username,
 * as well as a method to fetch the full user object from the Corbado API.
 *
 * The refresh-token should not be exposed from this service as it is only used for session refresh.
 */
export class SessionService {
  #usersApi: UsersApi = new UsersApi();
  #webAuthnService: WebAuthnService;

  readonly #projectId: string;
  readonly #isPreviewMode: boolean;
  readonly #frontendApiUrlSuffix: string;

  #sessionConfig: SessionConfigRsp | undefined;
  #sessionToken: SessionToken | undefined;

  /**
   * The refresh-token is returned in the response payload from the Frontend API if the project
   * environment is set to 'dev' and set in this property. If the project environment is not set
   * to 'dev' the refresh-token will be set as a cookie from the Frontend API (not part of the
   * response payload and you can not access it from JavaScript because it is a HTTP only cookie).
   * This is needed because Safari does not allow third-party cookies and for local development
   * you will most likely run your project on a different origin than the Frontend API
   * (e.g. http://localhost:3000 vs. https://pro-xxx.cloud.frontendapi.corbado.io). On production,
   * this is "fixed" by setting a CNAME on the Frontend API to align the origins (e.g.
   * https://www.example.com and https://auth.example.com).
   */
  #refreshToken: string | undefined;
  #refreshIntervalId: NodeJS.Timeout | undefined;

  #userChanges: BehaviorSubject<SessionUser | undefined> = new BehaviorSubject<SessionUser | undefined>(undefined);
  #sessionTokenChanges: BehaviorSubject<string | undefined> = new BehaviorSubject<string | undefined>(undefined);
  #authStateChanges: BehaviorSubject<AuthState> = new BehaviorSubject<AuthState>(AuthState.LoggedOut);

  constructor(projectId: string, isPreviewMode: boolean, frontendApiUrlSuffix: string) {
    this.#projectId = projectId;
    this.#isPreviewMode = isPreviewMode;
    this.#frontendApiUrlSuffix = frontendApiUrlSuffix;

    this.#webAuthnService = new WebAuthnService();
    this.#refreshToken = undefined;
  }

  /**
   * Initializes the SessionService by registering a callback that is called when the session-token changes.
   */
  async init(): Promise<CorbadoError | null> {
    const sessionConfig = await this.#loadSessionConfig();
    if (sessionConfig.err) {
      return sessionConfig.val;
    }

    if (!sessionConfig.val.useSessionManagement) {
      throw new SessionManagementNotEnabled();
    }

    this.#sessionConfig = sessionConfig.val;
    this.#refreshToken = SessionService.#getRefreshToken();
    this.#sessionToken = SessionService.#getSessionToken();

    // if the session is valid, we emit it
    if (this.#sessionToken && this.#sessionToken.isValidForXMoreSeconds(0)) {
      log.debug('emit session-token', this.#sessionToken);
      this.#onSessionTokenChange(this.#sessionToken);
    } else {
      await this.#handleRefreshRequest();
    }

    this.#setApisV2(this.#refreshToken);

    // init scheduled session refresh
    this.#refreshIntervalId = setInterval(() => {
      void this.#handleRefreshRequest();
    }, sessionTokenRefreshIntervalMs);

    document.addEventListener('visibilitychange', () => {
      this.#handleVisibilityChange();
    });

    return null;
  }

  /**
   * Getter method for retrieving the session-token.
   * @returns The session-token or null if it's not set.
   */
  public get sessionToken() {
    return this.#sessionToken;
  }

  /**
   * Getter method for retrieving the username.
   * @returns The username or null if it's not set.
   */
  public getUser(): SessionUser | undefined {
    if (!this.#sessionToken) {
      return;
    }

    const sessionParts = this.#sessionToken.value.split('.');

    return JSON.parse(base64decode(sessionParts[1]));
  }

  /**
   * Exposes changes to the user object
   */
  get userChanges(): BehaviorSubject<SessionUser | undefined> {
    return this.#userChanges;
  }

  /**
   * Exposes changes to the session-token.
   */
  get sessionTokenChanges(): BehaviorSubject<string | undefined> {
    return this.#sessionTokenChanges;
  }

  /**
   * Exposes changes to the auth state
   */
  get authStateChanges(): BehaviorSubject<AuthState> {
    return this.#authStateChanges;
  }

  dispose() {
    this.#webAuthnService.abortOngoingOperation();
  }

  public async getFullUser(abortController: AbortController): Promise<Result<CorbadoUser, CorbadoError>> {
    return this.wrapWithErr(async () => this.#usersApi.currentUserGet({ signal: abortController.signal }));
  }

  async appendPasskey(): Promise<Result<void, CorbadoError | undefined>> {
    const maybeClientHandle = ClientStateService.getClientEnvHandle(this.#projectId);
    const clientInformation = await this.#webAuthnService.getClientInformation(maybeClientHandle);
    const respStart = await this.#usersApi.currentUserPasskeyAppendStart({
      clientInformation: clientInformation,
    });

    if (respStart.data.newClientEnvHandle) {
      ClientStateService.setClientEnvHandle(this.#projectId, respStart.data.newClientEnvHandle);
    }

    if (respStart.data.appendNotAllowedReason) {
      switch (respStart.data.appendNotAllowedReason) {
        case 'passkey_already_exists':
          return Err(new PasskeyAlreadyExistsError());
        case 'passkeys_not_supported':
          return Err(new PasskeysNotSupported());
        default:
          return Err(CorbadoError.ignore());
      }
    }

    const signedChallenge = await this.#webAuthnService.createPasskey(respStart.data.attestationOptions);
    if (signedChallenge.err) {
      return signedChallenge;
    }

    await this.#usersApi.currentUserPasskeyAppendFinish({
      attestationResponse: signedChallenge.val,
      clientInformation: clientInformation,
    });

    return Ok(void 0);
  }

  async passkeyList(abortController: AbortController): Promise<Result<PassKeyList, CorbadoError>> {
    return this.wrapWithErr(async () => this.#usersApi.currentUserPasskeyGet({ signal: abortController.signal }));
  }

  async passkeyDelete(id: string): Promise<Result<void, PasskeyDeleteError>> {
    return Result.wrapAsync(async () => {
      await this.#usersApi.currentUserPasskeyDelete(id);
      return void 0;
    });
  }

  async logout() {
    log.debug('logging out user');
    await Result.wrapAsync(async () => {
      await this.#usersApi.currentUserSessionLogout({});
    });

    this.clear();
    this.#onSessionTokenChange(undefined);
  }

  #onSessionTokenChange(sessionToken: SessionToken | undefined) {
    const user = this.getUser();

    if (user && sessionToken) {
      this.#sessionTokenChanges.next(sessionToken.value);
      this.#updateAuthState(AuthState.LoggedIn);
      this.#updateUser(user);
    } else {
      log.debug('user is logged out', user, sessionToken);

      this.#sessionTokenChanges.next(undefined);
      this.#updateAuthState(AuthState.LoggedOut);
      this.#updateUser(undefined);
    }
  }

  /** Method to set Session
   * It sets the session-token, refresh-token, and username for the Corbado Application.
   * @param sessionToken The session-token to be set.
   * @param refreshToken The refresh-token to be set.
   */
  setSession(sessionToken: string, refreshToken: string | undefined) {
    const sessionTokenModel = new SessionToken(sessionToken);

    this.#setSessionToken(sessionTokenModel);
    this.#setApisV2(refreshToken ?? '');

    this.#onSessionTokenChange(sessionTokenModel);
    this.#setRefreshToken(refreshToken);
  }

  #setApisV2(refreshToken: string): void {
    let frontendApiUrl = this.#getSessionConfig().frontendApiUrl;
    if (!frontendApiUrl || frontendApiUrl.length === 0) {
      frontendApiUrl = this.#getDefaultFrontendApiUrl();
    }

    const config = new Configuration({
      apiKey: this.#projectId,
      basePath: frontendApiUrl,
    });
    const axiosInstance = this.#createAxiosInstanceV2(refreshToken);

    this.#usersApi = new UsersApi(config, frontendApiUrl, axiosInstance);
  }

  // usually sessionService needs a refresh-token for all it's requests
  // just the initial request to fetch the sessionConfig doesn't need it
  #createAxiosInstanceV2(refreshToken?: string): AxiosInstance {
    const corbadoVersion = {
      name: 'web-core',
      sdkVersion: packageVersion,
    };

    const headers: RawAxiosRequestHeaders | AxiosHeaders | Partial<HeadersDefaults> = {
      'Content-Type': 'application/json',
      'X-Corbado-SDK': JSON.stringify(corbadoVersion), // Example default version
      'X-Corbado-Client-Timezone': Intl.DateTimeFormat().resolvedOptions().timeZone,
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      Expires: '0',
    };

    headers['X-Corbado-Flags'] = this.#buildCorbadoFlags();

    let axiosInstance: AxiosInstance;
    if (refreshToken) {
      axiosInstance = axios.create({
        withCredentials: true,
        headers: { ...headers, Authorization: `Bearer ${refreshToken}` },
      });
    } else {
      axiosInstance = axios.create({
        withCredentials: true,
      });
    }

    // We transform AxiosErrors into CorbadoErrors using axios interceptors.
    axiosInstance.interceptors.response.use(
      response => response,
      (error: AxiosError) => {
        const e = CorbadoError.fromAxiosError(error);
        log.warn('error', e);
        return Promise.reject(e);
      },
    );

    return axiosInstance;
  }

  /**
   * Method to delete Session.
   * It deletes the session-token, refresh-token and username for the Corbado Application.
   */
  clear() {
    this.#deleteSessionToken();
    this.#deleteRefreshToken();

    if (this.#refreshIntervalId) {
      clearInterval(this.#refreshIntervalId);
    }
  }

  /**
   * Gets the session-token.
   */
  static #getSessionToken(): SessionToken | undefined {
    const sessionToken = this.#getCookieValue(sessionTokenKey);
    if (sessionToken) {
      return new SessionToken(sessionToken);
    }

    return undefined;
  }

  static #getCookieValue(name: string): string | undefined {
    const regex = new RegExp(`(^| )${name}=([^;]+)`);
    const match = document.cookie.match(regex);
    if (match) {
      return match[2];
    }

    return undefined;
  }

  /**
   * Deletes the refresh-token (see property for more details why this exists).
   */
  #deleteRefreshToken(): void {
    localStorage.removeItem(refreshTokenKey);
    this.#refreshToken = '';
  }

  /**
   * Gets the refresh-token (see property for more details why this exists).
   */
  static #getRefreshToken() {
    return (localStorage.getItem(refreshTokenKey) as string) ?? '';
  }

  /**
   * Sets the session-token.
   * @param value
   */
  #setSessionToken(value: SessionToken): void {
    this.#sessionToken = value;

    const cookieConfig = this.#getSessionTokenCookieConfig();
    document.cookie = this.#getSessionTokenCookieString(cookieConfig, value);
  }

  /**
   * Deletes the session-token.
   */
  #deleteSessionToken(): void {
    this.#sessionToken = undefined;

    const cookieConfig = this.#getSessionTokenCookieConfig();
    document.cookie = this.#getDeleteSessionTokenCookieString(cookieConfig);
  }

  #getSessionTokenCookieString(config: SessionTokenCookieConfig, value: SessionToken): string {
    const expires = new Date(Date.now() + config.lifetimeSeconds * 1000).toUTCString();
    return `${sessionTokenKey}=${value}; domain=${config.domain}; ${config.secure ? 'secure; ' : ''}sameSite=${
      config.sameSite
    }; path=${config.path}; expires=${expires}`;
  }

  #getDeleteSessionTokenCookieString(config: SessionTokenCookieConfig) {
    return `${sessionTokenKey}=; domain=${config.domain}; ${config.secure ? 'secure; ' : ''}sameSite=${
      config.sameSite
    }; path=${config.path}; expires=${new Date().toUTCString()}`;
  }

  /**
   * Sets the refresh-token (see property for more details why this exists).
   */
  #setRefreshToken(refreshToken: string | undefined): void {
    if (!refreshToken) {
      return;
    }

    localStorage.setItem(refreshTokenKey, refreshToken);
    this.#refreshToken = refreshToken;
  }

  async #handleRefreshRequest() {
    // no session-token => user is not logged in => nothing to refresh
    if (!this.#sessionToken) {
      log.debug('session refresh: no refresh, user not logged in');

      return;
    }

    // refresh, token too old
    if (!this.#sessionToken.isValidForXMoreSeconds(sessionTokenRefreshBeforeExpirationSeconds)) {
      await this.#refresh();
    }

    // nothing to do for now
    log.debug('no refresh, no refresh, token still valid');
    return;
  }

  async #refresh() {
    log.debug('session refresh: starting refresh');

    try {
      const options: AxiosRequestConfig = {
        headers: {
          Authorization: `Bearer ${this.#refreshToken}`,
        },
      };
      const response = await this.#usersApi.currentUserSessionRefresh(options);
      if (response.status !== 200) {
        log.warn(`refresh error, status code: ${response.status}`);
        return;
      }

      if (!response.data.sessionToken) {
        log.warn('refresh error, missing session-token');
        return;
      }

      this.setSession(response.data.sessionToken, undefined);
    } catch (e) {
      // if it's a network error, we should do a retry
      // for all other errors, we should log out the user
      log.warn(e);
      await this.logout();
    }
  }

  #handleVisibilityChange() {
    if (document.hidden) {
      log.debug('session refresh: no refresh, page is hidden');

      return;
    }

    try {
      void this.#handleRefreshRequest();
    } catch (e) {
      log.error(e);
    }
  }

  #updateUser = (user: SessionUser | undefined) => {
    const currentUser = this.#userChanges.value;

    if (currentUser === user) {
      return;
    }

    if (
      currentUser?.email === user?.email &&
      currentUser?.name === user?.name &&
      currentUser?.orig === user?.orig &&
      currentUser?.sub === user?.sub
    ) {
      return;
    }

    this.#userChanges.next(user);
  };

  #updateAuthState = (authState: AuthState) => {
    if (this.#authStateChanges.value === authState) {
      return;
    }

    this.#authStateChanges.next(authState);
  };

  #getSessionConfig = () => {
    if (!this.#sessionConfig) {
      throw CorbadoError.missingInit();
    }

    return this.#sessionConfig;
  };

  #getSessionTokenCookieConfig = (): SessionTokenCookieConfig => {
    const cfg = this.#getSessionConfig().sessionTokenCookieConfig;
    if (!cfg) {
      throw CorbadoError.invalidConfig();
    }

    return cfg;
  };

  #loadSessionConfig = async (): Promise<Result<SessionConfigRsp, CorbadoError>> => {
    const config = new Configuration({
      apiKey: this.#projectId,
    });

    const axiosInstance = this.#createAxiosInstanceV2();
    const configsApi = new ConfigsApi(config, this.#getDefaultFrontendApiUrl(), axiosInstance);

    return Result.wrapAsync(async () => {
      const r = await configsApi.getSessionConfig();
      return r.data;
    });
  };

  #getDefaultFrontendApiUrl() {
    return `https://${this.#projectId}.${this.#frontendApiUrlSuffix}`;
  }

  async wrapWithErr<T>(callback: () => Promise<AxiosResponse<T>>): Promise<Result<T, CorbadoError>> {
    try {
      const r = await callback();
      return Ok(r.data);
    } catch (e) {
      if (e instanceof CorbadoError) {
        return Err(e);
      }

      return Err(CorbadoError.fromUnknownFrontendError(e));
    }
  }

  #buildCorbadoFlags = (): string => {
    const flags: string[] = [];
    if (this.#isPreviewMode) {
      flags.push('preview');
    }

    return flags.join(',');
  };
}
