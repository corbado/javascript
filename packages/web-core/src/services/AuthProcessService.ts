import type { AxiosError, AxiosHeaders, AxiosInstance, HeadersDefaults, RawAxiosRequestHeaders } from 'axios';
import axios from 'axios';
import log from 'loglevel';
import type { Subject } from 'rxjs';
import { Ok, Result } from 'ts-results';

import { Configuration } from '../api/v1';
import type { BlockBody, LoginIdentifier, ProcessInitRsp } from '../api/v2';
import { AuthApi } from '../api/v2';
import { AuthProcess } from '../models/authProcess';
import type { GetProcessError } from '../utils';
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
  #authApi: AuthApi = new AuthApi();
  #webAuthnService: WebAuthnService;

  #globalErrors: Subject<NonRecoverableError | undefined>;

  // Private fields for project ID and default timeout for API calls.
  #projectId: string;
  #timeout: number;
  readonly #isPreviewMode: boolean;
  readonly #frontendApiUrl: string;

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
    this.#webAuthnService = new WebAuthnService(globalErrors);
    this.#isPreviewMode = isPreviewMode;

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
    if (!process) {
      return this.#initNewAuthProcess();
    }

    this.#setApisV2(process.id);
    const res = await this.#getAuthProcessState();
    if (res.err) {
      return this.#initNewAuthProcess();
    }

    return res.val;
  }

  #createAxiosInstanceV2(processId: string): AxiosInstance {
    const corbadoVersion = {
      name: 'web-core',
      sdkVersion: packageVersion,
    };

    const headers: RawAxiosRequestHeaders | AxiosHeaders | Partial<HeadersDefaults> = {
      'Content-Type': 'application/json',
      'X-Corbado-WC-Version': JSON.stringify(corbadoVersion), // Example default version
    };

    if (this.#isPreviewMode) {
      headers['X-Corbado-Mode'] = 'preview';
    }

    const out = axios.create({
      timeout: this.#timeout,
      withCredentials: true,
      headers: processId ? { ...headers, 'x-corbado-process-id': processId } : headers,
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

  async #initNewAuthProcess() {
    const processInitRsp = await this.#initAuthProcess();
    this.#setApisV2(processInitRsp.token);
    const newProcess = new AuthProcess(processInitRsp.token, processInitRsp.expiresAt);
    newProcess.persistToStorage();

    return processInitRsp.initialBlock;
  }

  #setApisV2(processId: string): void {
    const config = new Configuration({
      apiKey: this.#projectId,
      basePath: this.#frontendApiUrl,
    });
    const axiosInstance = this.#createAxiosInstanceV2(processId);

    this.#authApi = new AuthApi(config, this.#frontendApiUrl, axiosInstance);
  }

  async #initAuthProcess(): Promise<ProcessInitRsp> {
    const r = await this.#authApi.processInit({
      clientInfo: {},
    });

    return r.data;
  }

  async #getAuthProcessState(): Promise<Result<BlockBody, GetProcessError>> {
    return Result.wrapAsync(async () => {
      const r = await this.#authApi.processGet();

      return r.data;
    });
  }

  async finishAuthProcess(): Promise<BlockBody> {
    const r = await this.#authApi.processComplete();

    return r.data;
  }

  async initSignup(identifiers: LoginIdentifier[]): Promise<BlockBody> {
    const r = await this.#authApi.signupInit({
      identifiers: identifiers,
    });

    return r.data;
  }

  async skipBlock(): Promise<BlockBody> {
    const r = await this.#authApi.blockSkip();

    return r.data;
  }

  async startPasskeyAppend(): Promise<BlockBody> {
    const r = await this.#authApi.passkeyAppendStart({
      clientInfo: {},
    });

    return r.data;
  }

  async finishPasskeyAppend(signedChallenge: string): Promise<BlockBody> {
    const r = await this.#authApi.passkeyAppendFinish({
      clientInfo: {},
      signedChallenge: signedChallenge,
    });

    return r.data;
  }

  async startPasskeyLogin(): Promise<BlockBody> {
    // TODO: add real request
    const r = await this.#authApi.passkeyAppendStart({
      clientInfo: {},
    });

    return r.data;
  }

  async finishPasskeyLogin(): Promise<BlockBody> {
    // TODO: add real request
    const r = await this.#authApi.passkeyAppendStart({
      clientInfo: {},
    });

    return r.data;
  }

  async startPasskeyMediation(): Promise<BlockBody> {
    // TODO: add real request
    const r = await this.#authApi.passkeyAppendStart({
      clientInfo: {},
    });

    return r.data;
  }

  async startEmailCodeVerification(): Promise<BlockBody> {
    const r = await this.#authApi.emailVerifyStart({
      verificationType: 'email-otp',
    });

    return r.data;
  }

  async finishEmailCodeVerification(code: string): Promise<BlockBody> {
    const r = await this.#authApi.emailVerifyFinish({
      verificationType: 'email-otp',
      code: code,
      clientInfo: {},
    });

    return r.data;
  }

  async startEmailLinkVerification(): Promise<BlockBody> {
    const r = await this.#authApi.emailVerifyStart({
      verificationType: 'email-link',
    });

    return r.data;
  }

  async finishEmailLinkVerification(code: string): Promise<BlockBody> {
    const r = await this.#authApi.emailVerifyFinish({
      verificationType: 'email-link',
      code: code,
      clientInfo: {},
    });

    return r.data;
  }

  async startPhoneOtpVerification(): Promise<BlockBody> {
    const r = await this.#authApi.phoneVerifyStart({
      clientInfo: {},
    });

    return r.data;
  }

  async finishPhoneOtpVerification(code: string): Promise<BlockBody> {
    const r = await this.#authApi.phoneVerifyFinish({
      code: code,
      clientInfo: {},
    });

    return r.data;
  }

  abortOngoingPasskeyOperation() {
    this.#webAuthnService.abortOngoingOperation();
  }

  async appendPasskey(): Promise<Result<BlockBody, CorbadoError>> {
    const respStart = await this.startPasskeyAppend();
    if (respStart.error) {
      return Ok(respStart);
    }

    const signedChallenge = await this.#webAuthnService.createPasskey(respStart.data.challenge);
    if (signedChallenge.err) {
      // TODO: return block body with client generated error
      return signedChallenge;
    }

    const respFinish = await this.finishPasskeyAppend(signedChallenge.val);

    return Ok(respFinish);
  }

  // TODO: complete this method
  async loginWithPasskey(): Promise<BlockBody> {
    return await this.startPasskeyLogin();
  }
}
