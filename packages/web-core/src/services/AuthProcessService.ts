import type { AxiosError, AxiosInstance } from 'axios';
import axios from 'axios';
import log from 'loglevel';
import type { Subject } from 'rxjs';

import { Configuration } from '../api/v1';
import type { BlockBody, InitSessionRsp, LoginIdentifier } from '../api/v2';
import { AuthApi } from '../api/v2';
import { AuthProcess } from '../models/authProcess';
import { CorbadoError, NonRecoverableError } from '../utils';
import { WebAuthnService } from './WebAuthnService';

// TODO: set this version
const packageVersion = '0.0.0';

/**
 * ApiService class encapsulates API handling for the Corbado Application.
 * It manages API instances for users, projects, and sessions, and configures them with
 * authentication tokens and default settings such as timeout and headers.
 * ApiService should completely abstract away the API layer from the rest of the application.
 */
export class AuthProcessService {
  // Private API instances for various services.
  #authApi: AuthApi = new AuthApi();
  #webAuthnService: WebAuthnService;

  #globalErrors: Subject<NonRecoverableError | undefined>;

  // Private fields for project ID and default timeout for API calls.
  #projectId: string;
  #timeout: number;
  #frontendApiUrl: string;

  // #currentAuthProcess?: AuthProcess;

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
    this.#webAuthnService = new WebAuthnService(globalErrors);

    // Initializes the API instances with no authentication token.
    // Authentication tokens are set in the SessionService.
    this.#setApisV2('');
  }

  async init(isDebug = false): Promise<BlockBody> {
    if (isDebug) {
      log.setLevel('debug');
    } else {
      log.setLevel('error');
    }

    const process = AuthProcess.loadFromStorage();
    if (process) {
      this.#setApisV2(process.sessionId);
      // this.#currentAuthProcess = process;

      return this.#getAuthProcessState();
    }

    const initSessionRsp = await this.#initSession();
    this.#setApisV2(initSessionRsp.token);
    // this.#currentAuthProcess = new AuthProcess(initSessionRsp.token, initSessionRsp.expiresAt, processType);

    return initSessionRsp.initialBlock;
  }

  #createAxiosInstanceV2(sessionId: string): AxiosInstance {
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
      headers: sessionId ? { ...headers, sid: sessionId } : headers,
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

  #setApisV2(sessionId: string): void {
    const config = new Configuration({
      apiKey: this.#projectId,
      basePath: this.#frontendApiUrl,
    });
    const axiosInstance = this.#createAxiosInstanceV2(sessionId);

    this.#authApi = new AuthApi(config, this.#frontendApiUrl, axiosInstance);
  }

  async #initSession(): Promise<InitSessionRsp> {
    const r = await this.#authApi.initSession({
      clientInfo: {},
    });

    return r.data;
  }

  async #getAuthProcessState(): Promise<BlockBody> {
    const r = await this.#authApi.getSession();

    return r.data;
  }

  async initSignup(identifiers: LoginIdentifier[]): Promise<BlockBody> {
    const r = await this.#authApi.initSignup({
      identifiers: identifiers,
    });

    return r.data;
  }

  async startPasskeyAppend(): Promise<BlockBody> {
    const r = await this.#authApi.startPasskeyAppend({
      clientInfo: {},
    });

    return r.data;
  }

  async finishPasskeyAppend(signedChallenge: string): Promise<BlockBody> {
    const r = await this.#authApi.finishPasskeyAppend({
      clientInfo: {},
      signedChallenge: signedChallenge,
    });

    return r.data;
  }

  async startPasskeyLogin(): Promise<BlockBody> {
    // TODO: add real request
    const r = await this.#authApi.startPasskeyAppend({
      clientInfo: {},
    });

    return r.data;
  }

  async finishPasskeyLogin(): Promise<BlockBody> {
    // TODO: add real request
    const r = await this.#authApi.startPasskeyAppend({
      clientInfo: {},
    });

    return r.data;
  }

  async startPasskeyMediation(): Promise<BlockBody> {
    // TODO: add real request
    const r = await this.#authApi.startPasskeyAppend({
      clientInfo: {},
    });

    return r.data;
  }

  async startEmailCodeVerification(): Promise<BlockBody> {
    const r = await this.#authApi.startEmailVerify({
      verificationType: 'email-otp',
    });

    return r.data;
  }

  async finishEmailCodeVerification(code: string): Promise<BlockBody> {
    const r = await this.#authApi.finishEmailVerify({
      verificationType: 'email-otp',
      code: code,
      clientInfo: {},
    });

    return r.data;
  }

  async startEmailLinkVerification(): Promise<BlockBody> {
    const r = await this.#authApi.startEmailVerify({
      verificationType: 'email-link',
    });

    return r.data;
  }

  async finishEmailLinkVerification(code: string): Promise<BlockBody> {
    const r = await this.#authApi.finishEmailVerify({
      verificationType: 'email-link',
      code: code,
      clientInfo: {},
    });

    return r.data;
  }

  abortOngoingPasskeyOperation() {
    this.#webAuthnService.abortOngoingOperation();
  }

  async appendPasskey(): Promise<BlockBody> {
    const respStart = await this.startPasskeyAppend();
    if (respStart.error) {
      return respStart;
    }

    const signedChallenge = await this.#webAuthnService.createPasskey(respStart.data.challenge);
    if (signedChallenge.err) {
      // TODO: return block body with client generated error
      return respStart;
    }

    return await this.finishPasskeyAppend(signedChallenge.val);
  }

  // TODO: complete this method
  async loginWithPasskey(): Promise<BlockBody> {
    return await this.startPasskeyLogin();
  }
}
