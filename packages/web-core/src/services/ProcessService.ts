import type { AxiosError, AxiosHeaders, AxiosInstance, HeadersDefaults, RawAxiosRequestHeaders } from 'axios';
import axios from 'axios';
import log from 'loglevel';
import type { Subject } from 'rxjs';
import { Ok, Result } from 'ts-results';

import { Configuration } from '../api/v1';
import type { LoginIdentifier, ProcessInitRsp, ProcessResponse } from '../api/v2';
import { AuthApi } from '../api/v2';
import { AuthProcess } from '../models/authProcess';
import type { GetProcessError } from '../utils';
import { CorbadoError, NonRecoverableError } from '../utils';
import { WebAuthnService } from './WebAuthnService';

// TODO: set this version
const packageVersion = '0.0.0';
const clientHandleKey = 'cbo_client_handle';

export class ProcessService {
  #authApi: AuthApi = new AuthApi();
  #webAuthnService: WebAuthnService;

  #globalErrors: Subject<NonRecoverableError | undefined>;

  // Private fields for project ID and default timeout for API calls.
  #projectId: string;
  #timeout: number;
  readonly #isPreviewMode: boolean;
  readonly #frontendApiUrl: string;

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

  async init(isDebug = false): Promise<Result<ProcessResponse, CorbadoError>> {
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

    return res;
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

  async #initNewAuthProcess(): Promise<Result<ProcessResponse, CorbadoError>> {
    const res = await this.#initAuthProcess();
    if (res.err) {
      return res;
    }

    this.#setApisV2(res.val.token);
    const newProcess = new AuthProcess(res.val.token, res.val.expiresAt);
    newProcess.persistToStorage();

    return Ok(res.val.processResponse);
  }

  #setApisV2(processId: string): void {
    const config = new Configuration({
      apiKey: this.#projectId,
      basePath: this.#frontendApiUrl,
    });
    const axiosInstance = this.#createAxiosInstanceV2(processId);

    this.#authApi = new AuthApi(config, this.#frontendApiUrl, axiosInstance);
  }

  async #initAuthProcess(): Promise<Result<ProcessInitRsp, CorbadoError>> {
    const maybeClientHandle = localStorage.getItem(clientHandleKey);
    const canUsePasskeys =
      window.PublicKeyCredential && (await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable());

    const res = await this.#processInit(canUsePasskeys, maybeClientHandle ?? undefined);
    if (res.err) {
      return res;
    }

    // if the backend decides that a new client handle is needed, we store it in local storage
    if (res.val.newClientEnvHandle) {
      localStorage.setItem(clientHandleKey, res.val.newClientEnvHandle);
    }

    return res;
  }

  #processInit(
    canUsePasskeys: boolean,
    clientHandle: string | undefined,
  ): Promise<Result<ProcessInitRsp, CorbadoError>> {
    return Result.wrapAsync(async () => {
      const r = await this.#authApi.processInit({
        clientInformation: {
          bluetoothAvailable: false,
          canUsePasskeys: canUsePasskeys,
          clientEnvHandle: clientHandle,
        },
      });

      return r.data;
    });
  }

  async #getAuthProcessState(): Promise<Result<ProcessResponse, GetProcessError>> {
    return Result.wrapAsync(async () => {
      const r = await this.#authApi.processGet();

      return r.data;
    });
  }

  async finishAuthProcess(): Promise<ProcessResponse> {
    const r = await this.#authApi.processComplete();

    return r.data;
  }

  async initSignup(identifiers: LoginIdentifier[]): Promise<ProcessResponse> {
    const r = await this.#authApi.signupInit({
      identifiers: identifiers,
    });

    return r.data;
  }

  async initLogin(identifierValue: string, isPhone: boolean): Promise<ProcessResponse> {
    const r = await this.#authApi.loginInit({
      isPhone: isPhone,
      identifierValue: identifierValue,
    });

    return r.data;
  }

  async skipBlock(): Promise<ProcessResponse> {
    const r = await this.#authApi.blockSkip();

    return r.data;
  }

  async startPasskeyAppend(): Promise<ProcessResponse> {
    const r = await this.#authApi.passkeyAppendStart({
      clientInfo: {},
    });

    return r.data;
  }

  async finishPasskeyAppend(signedChallenge: string): Promise<ProcessResponse> {
    const r = await this.#authApi.passkeyAppendFinish({
      signedChallenge: signedChallenge,
    });

    return r.data;
  }

  async startPasskeyLogin(): Promise<ProcessResponse> {
    const r = await this.#authApi.passkeyLoginStart({});

    return r.data;
  }

  async finishPasskeyLogin(signedChallenge: string): Promise<ProcessResponse> {
    const r = await this.#authApi.passkeyLoginFinish({
      signedChallenge: signedChallenge,
    });

    return r.data;
  }

  async startPasskeyMediation(): Promise<ProcessResponse> {
    // TODO: add real request
    const r = await this.#authApi.passkeyAppendStart({
      clientInfo: {},
    });

    return r.data;
  }

  async startEmailCodeVerification(): Promise<ProcessResponse> {
    const r = await this.#authApi.identifierVerifyStart({
      verificationType: 'email-otp',
      identifierType: 'email',
    });

    return r.data;
  }

  async finishEmailCodeVerification(code: string): Promise<ProcessResponse> {
    const r = await this.#authApi.identifierVerifyFinish({
      verificationType: 'email-otp',
      identifierType: 'email',
      code: code,
    });

    return r.data;
  }

  async startEmailLinkVerification(): Promise<ProcessResponse> {
    const r = await this.#authApi.identifierVerifyStart({
      verificationType: 'email-link',
      identifierType: 'email',
    });

    return r.data;
  }

  async finishEmailLinkVerification(code: string): Promise<ProcessResponse> {
    const r = await this.#authApi.identifierVerifyFinish({
      verificationType: 'email-link',
      identifierType: 'email',
      code: code,
    });

    return r.data;
  }

  async updateEmail(email: string): Promise<ProcessResponse> {
    const r = await this.#authApi.identifierUpdate({
      identifierType: 'email',
      value: email,
    });

    return r.data;
  }

  async updatePhone(phone: string): Promise<ProcessResponse> {
    const r = await this.#authApi.identifierUpdate({
      identifierType: 'phone',
      value: phone,
    });

    return r.data;
  }

  async updateUsername(username: string): Promise<ProcessResponse> {
    const r = await this.#authApi.identifierUpdate({
      identifierType: 'username',
      value: username,
    });

    return r.data;
  }

  async startPhoneOtpVerification(): Promise<ProcessResponse> {
    const r = await this.#authApi.identifierVerifyStart({
      verificationType: 'sms-otp',
      identifierType: 'phone',
    });

    return r.data;
  }

  async finishPhoneOtpVerification(code: string): Promise<ProcessResponse> {
    const r = await this.#authApi.identifierVerifyFinish({
      verificationType: 'sms-otp',
      identifierType: 'phone',
      code: code,
    });

    return r.data;
  }

  abortOngoingPasskeyOperation() {
    this.#webAuthnService.abortOngoingOperation();
  }

  async appendPasskey(): Promise<Result<ProcessResponse, CorbadoError>> {
    const respStart = await this.startPasskeyAppend();
    if (respStart.blockBody.error) {
      return Ok(respStart);
    }

    const signedChallenge = await this.#webAuthnService.createPasskey(respStart.blockBody.data.challenge);
    if (signedChallenge.err) {
      // TODO: return block body with client generated error
      return signedChallenge;
    }

    const respFinish = await this.finishPasskeyAppend(signedChallenge.val);

    return Ok(respFinish);
  }

  async loginWithPasskey(): Promise<Result<ProcessResponse, CorbadoError>> {
    const respStart = await this.startPasskeyLogin();
    if (respStart.blockBody.error) {
      return Ok(respStart);
    }

    const signedChallenge = await this.#webAuthnService.login(respStart.blockBody.data.challenge, false);
    if (signedChallenge.err) {
      // TODO: return block body with client generated error
      return signedChallenge;
    }

    const respFinish = await this.finishPasskeyLogin(signedChallenge.val);

    return Ok(respFinish);
  }
}
