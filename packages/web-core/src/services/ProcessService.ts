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
import type { LoginIdentifier, ProcessInitReq, ProcessInitRsp, ProcessResponse } from '../api/v2';
import { AuthApi, BlockType, LoginIdentifierType, VerificationMethod } from '../api/v2';
import { AuthProcess } from '../models/authProcess';
import { EmailVerifyFromUrl } from '../models/emailVerifyFromUrl';
import { CorbadoError } from '../utils';
import { WebAuthnService } from './WebAuthnService';

const packageVersion = process.env.FE_LIBRARY_VERSION;
const passkeyAppendShownKey = 'cbo_passkey_append_shown';

export class ProcessService {
  #authApi: AuthApi = new AuthApi();
  #webAuthnService: WebAuthnService;

  // Private fields for project ID and default timeout for API calls.
  #projectId: string;
  #timeout: number;
  readonly #isPreviewMode: boolean;
  readonly #frontendApiUrlSuffix: string;

  constructor(projectId: string, timeout: number = 30 * 1000, isPreviewMode: boolean, frontendApiUrlSuffix: string) {
    this.#projectId = projectId;
    this.#timeout = timeout;
    this.#frontendApiUrlSuffix = frontendApiUrlSuffix;
    this.#webAuthnService = new WebAuthnService();
    this.#isPreviewMode = isPreviewMode;

    // Initializes the API instances with no authentication token.
    // Authentication tokens are set in the SessionService.
    this.#setApisV2();
  }

  async init(
    abortController: AbortController,
    frontendPreferredBlockType?: BlockType,
    isDebug = false,
  ): Promise<Result<ProcessResponse, CorbadoError>> {
    if (isDebug) {
      log.setLevel('debug');
    } else {
      log.setLevel('error');
    }

    // we check if there is a process in local storage, if not we have to create a new one
    const process = AuthProcess.loadFromStorage();
    if (!process) {
      return this.#initNewAuthProcess(abortController, frontendPreferredBlockType);
    }

    // if the process is already in local storage, we configure the client to use the existing process (we do not know about the
    this.#setApisV2(process);
    const res = await this.#getAuthProcessState(abortController, frontendPreferredBlockType);
    if (res.err) {
      return this.#initNewAuthProcess(abortController);
    }

    // if the process does not contain any state yet, we recreate it from backend to get potential config changes
    // we might disable this for PROD projects
    const initial = isProcessInitial(res.val);
    if (initial) {
      return this.#initNewAuthProcess(abortController, frontendPreferredBlockType);
    }

    return res;
  }

  clearProcess() {
    return AuthProcess.clearStorage();
  }

  initEmailVerifyFromUrl(): Result<EmailVerifyFromUrl | null, CorbadoError> {
    const searchParams = new URLSearchParams(window.location.search);
    const encodedProcess = searchParams.get('corbadoEmailLinkID');
    if (!encodedProcess) {
      return Ok(null);
    }

    const token = searchParams.get('corbadoToken');
    if (!token) {
      return Ok(null);
    }

    try {
      const maybeProcess = AuthProcess.loadFromStorage();
      const emailVerifyFromUrl = EmailVerifyFromUrl.fromURL(encodedProcess, token, maybeProcess);

      this.#setApisV2(emailVerifyFromUrl.process);

      return Ok(emailVerifyFromUrl);
    } catch (e) {
      return Err(CorbadoError.fromUnknownFrontendError(e));
    }
  }

  #createAxiosInstanceV2(processId: string): AxiosInstance {
    const corbadoVersion = {
      name: 'web-core',
      sdkVersion: packageVersion,
    };

    const headers: RawAxiosRequestHeaders | AxiosHeaders | Partial<HeadersDefaults> = {
      'Content-Type': 'application/json',
      'X-Corbado-WC-Version': JSON.stringify(corbadoVersion),
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

  async #initNewAuthProcess(
    abortController: AbortController,
    frontendPreferredBlockType?: BlockType,
  ): Promise<Result<ProcessResponse, CorbadoError>> {
    const res = await this.#initAuthProcess(abortController, frontendPreferredBlockType);
    if (res.err) {
      return res;
    }

    const newProcess = new AuthProcess(res.val.token, res.val.expiresAt, res.val.processResponse.common.frontendApiUrl);
    this.#setApisV2(newProcess);
    newProcess.persistToStorage();

    return Ok(res.val.processResponse);
  }

  #setApisV2(process?: AuthProcess): void {
    let frontendApiUrl = this.#getDefaultFrontendApiUrl();
    if (process?.frontendApiUrl && process?.frontendApiUrl.length > 0) {
      frontendApiUrl = process.frontendApiUrl;
    }

    const config = new Configuration({
      apiKey: this.#projectId,
      basePath: frontendApiUrl,
    });
    const axiosInstance = this.#createAxiosInstanceV2(process?.id ?? '');

    this.#authApi = new AuthApi(config, frontendApiUrl, axiosInstance);
  }

  async #initAuthProcess(
    abortController: AbortController,
    frontendPreferredBlockType?: BlockType,
  ): Promise<Result<ProcessInitRsp, CorbadoError>> {
    const maybeClientHandle = WebAuthnService.getClientHandle();

    const passkeyAppendShownRaw = localStorage.getItem(passkeyAppendShownKey);
    let passkeyAppendShown: number | null = null;
    if (passkeyAppendShownRaw) {
      passkeyAppendShown = parseInt(passkeyAppendShownRaw, 10);
    }

    const canUsePasskeys = await WebAuthnService.doesBrowserSupportPasskeys();
    const res = await this.#processInit(
      abortController,
      canUsePasskeys,
      maybeClientHandle,
      passkeyAppendShown,
      frontendPreferredBlockType,
    );
    if (res.err) {
      return res;
    }

    // if the backend decides that a new client handle is needed, we store it in local storage
    if (res.val.newClientEnvHandle) {
      WebAuthnService.setClientHandle(res.val.newClientEnvHandle);
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
    clientHandle: string | null,
    passkeyAppendShown: number | null,
    frontendPreferredBlockType?: BlockType,
  ): Promise<Result<ProcessInitRsp, CorbadoError>> {
    const req: ProcessInitReq = {
      clientInformation: {
        bluetoothAvailable: false,
        canUsePasskeys: canUsePasskeys,
        clientEnvHandle: clientHandle ?? undefined,
        javaScriptHighEntropy: await WebAuthnService.getHighEntropyValues(),
      },
      passkeyAppendShown: passkeyAppendShown ?? undefined,
      preferredBlock: frontendPreferredBlockType,
    };

    return this.wrapWithErr(() => this.#authApi.processInit(req, { signal: abortController.signal }));
  }

  async #getAuthProcessState(
    abortController: AbortController,
    frontendPreferredBlockType?: BlockType,
  ): Promise<Result<ProcessResponse, CorbadoError>> {
    return Result.wrapAsync(async () => {
      const r = await this.#authApi.processGet(frontendPreferredBlockType, { signal: abortController.signal });
      return r.data;
    });
  }

  async finishAuthProcess(): Promise<Result<ProcessResponse, CorbadoError>> {
    return Result.wrapAsync(async () => {
      const r = await this.#authApi.processComplete();
      return r.data;
    });
  }

  async resetAuthProcess(): Promise<Result<ProcessResponse, CorbadoError>> {
    return Result.wrapAsync(async () => {
      const r = await this.#authApi.processReset();
      return r.data;
    });
  }

  async initSignup(identifiers: LoginIdentifier[], fullName?: string): Promise<Result<ProcessResponse, CorbadoError>> {
    return Result.wrapAsync(async () => {
      const r = await this.#authApi.signupInit({
        identifiers: identifiers,
        fullName: fullName,
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

  async finishPasskeyMediation(signedChallenge: string): Promise<Result<ProcessResponse, CorbadoError>> {
    return Result.wrapAsync(async () => {
      const r = await this.#authApi.passkeyMediationFinish({
        signedChallenge: signedChallenge,
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

  async loginWithPasskeyChallenge(challenge: string): Promise<Result<ProcessResponse, CorbadoError>> {
    const signedChallenge = await this.#webAuthnService.login(challenge, true);
    if (signedChallenge.err) {
      // TODO: return block body with client generated error
      return signedChallenge;
    }

    return await this.finishPasskeyMediation(signedChallenge.val);
  }

  // record time of last passkey append as unix timestamp (seconds)
  dropPasskeyAppendShown(): void {
    const now = new Date();
    const utcSeconds = Math.floor((now.getTime() + now.getTimezoneOffset() * 60 * 1000) / 1000);

    localStorage.setItem(passkeyAppendShownKey, utcSeconds.toString());
  }

  dispose() {
    this.#webAuthnService.abortOngoingOperation();
  }

  #getDefaultFrontendApiUrl() {
    return `https://${this.#projectId}.${this.#frontendApiUrlSuffix}`;
  }
}

// returns true if the current process does not contain any meaningful data any can thus be reset to a new process
function isProcessInitial(process: ProcessResponse): boolean {
  switch (process.blockBody.block) {
    case BlockType.LoginInit:
      return process.blockBody.data.identifierValue.length === 0;
    case BlockType.SignupInit:
      return process.blockBody.data.identifiers.reduce((acc, curr) => acc && curr.identifier.length === 0, true);
    default:
      return false;
  }
}
