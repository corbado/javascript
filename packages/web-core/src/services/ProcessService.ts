import type {
  AxiosError,
  AxiosHeaders,
  AxiosInstance,
  AxiosResponse,
  HeadersDefaults,
  RawAxiosRequestHeaders,
} from 'axios';
import axios from 'axios';
import log from 'loglevel';
import { Err, Ok, Result } from 'ts-results';

import { Configuration } from '../api/v1';
import type { LoginIdentifier, ProcessInitRsp, ProcessResponse } from '../api/v2';
import { LoginIdentifierType, VerificationMethod } from '../api/v2';
import { AuthApi } from '../api/v2';
import { AuthProcess } from '../models/authProcess';
import { EmailVerifyFromUrl } from '../models/emailVerifyFromUrl';
import { CorbadoError } from '../utils';
import { WebAuthnService } from './WebAuthnService';

// TODO: set this version
const packageVersion = '0.0.0';
const clientHandleKey = 'cbo_client_handle';

export class ProcessService {
  #authApi: AuthApi = new AuthApi();
  #webAuthnService: WebAuthnService;

  // Private fields for project ID and default timeout for API calls.
  #projectId: string;
  #timeout: number;
  readonly #isPreviewMode: boolean;
  readonly #frontendApiUrl: string;

  constructor(projectId: string, timeout: number = 30 * 1000, isPreviewMode: boolean, frontendApiUrl?: string) {
    this.#projectId = projectId;
    this.#timeout = timeout;
    this.#frontendApiUrl = frontendApiUrl || `https://${this.#projectId}.frontendapi.corbado.io`;
    this.#webAuthnService = new WebAuthnService();
    this.#isPreviewMode = isPreviewMode;

    // Initializes the API instances with no authentication token.
    // Authentication tokens are set in the SessionService.
    this.#setApisV2('');
  }

  async init(abortController: AbortController, isDebug = false): Promise<Result<ProcessResponse, CorbadoError>> {
    if (isDebug) {
      log.setLevel('debug');
    } else {
      log.setLevel('error');
    }

    const process = AuthProcess.loadFromStorage();
    if (!process) {
      return this.#initNewAuthProcess(abortController);
    }

    this.#setApisV2(process.id);
    const res = await this.#getAuthProcessState(abortController);
    if (res.err) {
      return this.#initNewAuthProcess(abortController);
    }

    return res;
  }

  clearProcess() {
    return AuthProcess.clearStorage();
  }

  initEmailVerifyFromUrl(): EmailVerifyFromUrl | null {
    const searchParams = new URLSearchParams(window.location.search);
    const encodedProcess = searchParams.get('corbadoEmailLinkID');
    if (!encodedProcess) {
      return null;
    }

    const token = searchParams.get('corbadoToken');
    if (!token) {
      return null;
    }

    const maybeProcess = AuthProcess.loadFromStorage();
    const emailVerifyFromUrl = EmailVerifyFromUrl.fromURL(encodedProcess, token, maybeProcess);

    this.#setApisV2(emailVerifyFromUrl.processID);

    return emailVerifyFromUrl;
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
      response => response,
      (error: AxiosError) => {
        console.log('axios error', error);
        const e = CorbadoError.fromAxiosError(error);
        return Promise.reject(e);
      },
    );

    return out;
  }

  async #initNewAuthProcess(abortController: AbortController): Promise<Result<ProcessResponse, CorbadoError>> {
    const res = await this.#initAuthProcess(abortController);
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

  async #initAuthProcess(abortController: AbortController): Promise<Result<ProcessInitRsp, CorbadoError>> {
    const maybeClientHandle = localStorage.getItem(clientHandleKey);
    const canUsePasskeys =
      window.PublicKeyCredential && (await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable());

    const res = await this.#processInit(abortController, canUsePasskeys, maybeClientHandle ?? undefined);
    if (res.err) {
      return res;
    }

    // if the backend decides that a new client handle is needed, we store it in local storage
    if (res.val.newClientEnvHandle) {
      localStorage.setItem(clientHandleKey, res.val.newClientEnvHandle);
    }

    return res;
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

  async #processInit(
    abortController: AbortController,
    canUsePasskeys: boolean,
    clientHandle: string | undefined,
  ): Promise<Result<ProcessInitRsp, CorbadoError>> {
    const req = {
      clientInformation: {
        bluetoothAvailable: false,
        canUsePasskeys: canUsePasskeys,
        clientEnvHandle: clientHandle,
      },
    };

    return this.wrapWithErr(() => this.#authApi.processInit(req, { signal: abortController.signal }));
  }

  async #getAuthProcessState(abortController: AbortController): Promise<Result<ProcessResponse, CorbadoError>> {
    return Result.wrapAsync(async () => {
      const r = await this.#authApi.processGet(abortController);
      return r.data;
    });
  }

  async finishAuthProcess(): Promise<Result<ProcessResponse, CorbadoError>> {
    return Result.wrapAsync(async () => {
      const r = await this.#authApi.processComplete();
      return r.data;
    });
  }

  async initSignup(identifiers: LoginIdentifier[]): Promise<Result<ProcessResponse, CorbadoError>> {
    return Result.wrapAsync(async () => {
      const r = await this.#authApi.signupInit({
        identifiers: identifiers,
      });
      return r.data;
    });
  }

  async initLogin(identifierValue: string, isPhone: boolean): Promise<Result<ProcessResponse, CorbadoError>> {
    return Result.wrapAsync(async () => {
      const r = await this.#authApi.loginInit({
        isPhone: isPhone,
        identifierValue: identifierValue,
      });

      return r.data;
    });
  }

  async skipBlock(): Promise<Result<ProcessResponse, CorbadoError>> {
    return Result.wrapAsync(async () => {
      const r = await this.#authApi.blockSkip();
      return r.data;
    });
  }

  async startPasskeyAppend(): Promise<Result<ProcessResponse, CorbadoError>> {
    return Result.wrapAsync(async () => {
      const r = await this.#authApi.passkeyAppendStart({
        clientInfo: {},
      });

      return r.data;
    });
  }

  async finishPasskeyAppend(signedChallenge: string): Promise<Result<ProcessResponse, CorbadoError>> {
    return Result.wrapAsync(async () => {
      const r = await this.#authApi.passkeyAppendFinish({
        signedChallenge: signedChallenge,
      });

      return r.data;
    });
  }

  async startPasskeyLogin(): Promise<Result<ProcessResponse, CorbadoError>> {
    return Result.wrapAsync(async () => {
      const r = await this.#authApi.passkeyLoginStart({});
      return r.data;
    });
  }

  async finishPasskeyLogin(signedChallenge: string): Promise<Result<ProcessResponse, CorbadoError>> {
    return Result.wrapAsync(async () => {
      const r = await this.#authApi.passkeyLoginFinish({
        signedChallenge: signedChallenge,
      });

      return r.data;
    });
  }

  async startPasskeyMediation(): Promise<Result<ProcessResponse, CorbadoError>> {
    return Result.wrapAsync(async () => {
      // TODO: add real request
      const r = await this.#authApi.passkeyAppendStart({
        clientInfo: {},
      });

      return r.data;
    });
  }

  async startEmailCodeVerification(): Promise<Result<ProcessResponse, CorbadoError>> {
    return Result.wrapAsync(async () => {
      const r = await this.#authApi.identifierVerifyStart({
        verificationType: 'email-otp',
        identifierType: 'email',
      });

      return r.data;
    });
  }

  async finishEmailCodeVerification(code: string): Promise<Result<ProcessResponse, CorbadoError>> {
    return Result.wrapAsync(async () => {
      const r = await this.#authApi.identifierVerifyFinish({
        verificationType: 'email-otp',
        identifierType: 'email',
        code: code,
        isNewDevice: false,
      });

      return r.data;
    });
  }

  async startEmailLinkVerification(): Promise<Result<ProcessResponse, CorbadoError>> {
    return Result.wrapAsync(async () => {
      const r = await this.#authApi.identifierVerifyStart({
        verificationType: 'email-link',
        identifierType: 'email',
      });

      return r.data;
    });
  }

  finishEmailLinkVerification(
    abortController: AbortController,
    code: string,
    isNewDevice: boolean,
  ): Promise<Result<ProcessResponse, CorbadoError>> {
    const req = {
      verificationType: VerificationMethod.EmailLink,
      identifierType: LoginIdentifierType.Email,
      code: code,
      isNewDevice: isNewDevice,
    };

    return this.wrapWithErr(() => this.#authApi.identifierVerifyFinish(req, { signal: abortController.signal }));
  }

  getVerificationStatus(): Promise<Result<ProcessResponse, CorbadoError>> {
    return Result.wrapAsync(async () => {
      const r = await this.#authApi.identifierVerifyStatus();
      return r.data;
    });
  }

  async updateEmail(email: string): Promise<Result<ProcessResponse, CorbadoError>> {
    return Result.wrapAsync(async () => {
      const r = await this.#authApi.identifierUpdate({
        identifierType: 'email',
        value: email,
      });

      return r.data;
    });
  }

  async updatePhone(phone: string): Promise<Result<ProcessResponse, CorbadoError>> {
    return Result.wrapAsync(async () => {
      const r = await this.#authApi.identifierUpdate({
        identifierType: 'phone',
        value: phone,
      });

      return r.data;
    });
  }

  async updateUsername(username: string): Promise<Result<ProcessResponse, CorbadoError>> {
    return Result.wrapAsync(async () => {
      const r = await this.#authApi.identifierUpdate({
        identifierType: 'username',
        value: username,
      });

      return r.data;
    });
  }

  async startPhoneOtpVerification(): Promise<Result<ProcessResponse, CorbadoError>> {
    return Result.wrapAsync(async () => {
      const r = await this.#authApi.identifierVerifyStart({
        verificationType: 'phone-otp',
        identifierType: 'phone',
      });

      return r.data;
    });
  }

  async finishPhoneOtpVerification(code: string): Promise<Result<ProcessResponse, CorbadoError>> {
    return Result.wrapAsync(async () => {
      const r = await this.#authApi.identifierVerifyFinish({
        verificationType: 'phone-otp',
        identifierType: 'phone',
        code: code,
        isNewDevice: false,
      });

      return r.data;
    });
  }

  async appendPasskey(): Promise<Result<ProcessResponse, CorbadoError>> {
    const respStart = await this.startPasskeyAppend();
    if (respStart.err) {
      return respStart;
    }

    if (respStart.val.blockBody.error) {
      return respStart;
    }

    const signedChallenge = await this.#webAuthnService.createPasskey(respStart.val.blockBody.data.challenge);
    if (signedChallenge.err) {
      // TODO: return block body with client generated error
      return signedChallenge;
    }

    return await this.finishPasskeyAppend(signedChallenge.val);
  }

  async loginWithPasskey(): Promise<Result<ProcessResponse, CorbadoError>> {
    const respStart = await this.startPasskeyLogin();
    if (respStart.err) {
      return respStart;
    }

    if (respStart.val.blockBody.error) {
      return respStart;
    }

    const signedChallenge = await this.#webAuthnService.login(respStart.val.blockBody.data.challenge, false);
    if (signedChallenge.err) {
      // TODO: return block body with client generated error
      return signedChallenge;
    }

    return await this.finishPasskeyLogin(signedChallenge.val);
  }

  dispose() {
    this.#webAuthnService.abortOngoingOperation();
  }
}
