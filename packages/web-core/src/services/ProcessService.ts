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
import type { Result } from 'ts-results';
import { Err, Ok } from 'ts-results';

import { Configuration } from '../api/v1';
import type {
  AuthType,
  LoginIdentifier,
  ProcessInitReq,
  ProcessInitRsp,
  ProcessResponse,
  SocialProviderType,
} from '../api/v2';
import { SocialDataStatusEnum } from '../api/v2';
import { AuthApi, BlockType, LoginIdentifierType, VerificationMethod } from '../api/v2';
import { AuthProcess } from '../models/authProcess';
import { EmailVerifyFromUrl } from '../models/emailVerifyFromUrl';
import { CorbadoError } from '../utils';
import { WebAuthnService } from './WebAuthnService';

// TODO: set this version
const packageVersion = '0.0.0';
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
      console.log('process is missing');
      return this.#initNewAuthProcess(abortController, frontendPreferredBlockType);
    }

    // if the process is already in local storage, we configure the client to use the existing process (we do not know about the
    this.#setApisV2(process);
    const res = await this.#getAuthProcessState(abortController, frontendPreferredBlockType);
    if (res.err && res.val.ignore) {
      return res;
    }

    if (res.err) {
      console.log('process has error', res.val);
      return this.#initNewAuthProcess(abortController);
    }

    // if the process does not contain any state yet, we recreate it from backend to get potential config changes
    // we might disable this for PROD projects
    const initial = isProcessInitial(res.val);
    if (initial) {
      console.log('process is initial');
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

  async #initNewAuthProcess(
    abortController: AbortController,
    frontendPreferredBlockType?: BlockType,
  ): Promise<Result<ProcessResponse, CorbadoError>> {
    console.log('initNewAuthProcess');
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
    return this.wrapWithErr(() =>
      this.#authApi.processGet(frontendPreferredBlockType, { signal: abortController.signal }),
    );
  }

  async finishAuthProcess(): Promise<Result<ProcessResponse, CorbadoError>> {
    return this.wrapWithErr(() => this.#authApi.processComplete());
  }

  async resetAuthProcess(): Promise<Result<ProcessResponse, CorbadoError>> {
    return this.wrapWithErr(() => this.#authApi.processReset());
  }

  async initSignup(identifiers: LoginIdentifier[], fullName?: string): Promise<Result<ProcessResponse, CorbadoError>> {
    return this.wrapWithErr(() =>
      this.#authApi.signupInit({
        identifiers: identifiers,
        fullName: fullName,
      }),
    );
  }

  async initLogin(identifierValue: string, isPhone: boolean): Promise<Result<ProcessResponse, CorbadoError>> {
    return this.wrapWithErr(() =>
      this.#authApi.loginInit({
        isPhone: isPhone,
        identifierValue: identifierValue,
      }),
    );
  }

  async skipBlock(): Promise<Result<ProcessResponse, CorbadoError>> {
    return this.wrapWithErr(() => this.#authApi.blockSkip());
  }

  async startPasskeyAppend(): Promise<Result<ProcessResponse, CorbadoError>> {
    return this.wrapWithErr(() =>
      this.#authApi.passkeyAppendStart({
        clientInfo: {},
      }),
    );
  }

  async finishPasskeyAppend(signedChallenge: string): Promise<Result<ProcessResponse, CorbadoError>> {
    return this.wrapWithErr(() =>
      this.#authApi.passkeyAppendFinish({
        signedChallenge: signedChallenge,
      }),
    );
  }

  async startPasskeyLogin(): Promise<Result<ProcessResponse, CorbadoError>> {
    return this.wrapWithErr(() => this.#authApi.passkeyLoginStart({}));
  }

  async finishPasskeyLogin(signedChallenge: string): Promise<Result<ProcessResponse, CorbadoError>> {
    return this.wrapWithErr(() =>
      this.#authApi.passkeyLoginFinish({
        signedChallenge: signedChallenge,
      }),
    );
  }

  async finishPasskeyMediation(signedChallenge: string): Promise<Result<ProcessResponse, CorbadoError>> {
    return this.wrapWithErr(() =>
      this.#authApi.passkeyMediationFinish({
        signedChallenge: signedChallenge,
      }),
    );
  }

  async startEmailCodeVerification(): Promise<Result<ProcessResponse, CorbadoError>> {
    return this.wrapWithErr(() =>
      this.#authApi.identifierVerifyStart({
        verificationType: 'email-otp',
        identifierType: 'email',
      }),
    );
  }

  async finishEmailCodeVerification(code: string): Promise<Result<ProcessResponse, CorbadoError>> {
    return this.wrapWithErr(() =>
      this.#authApi.identifierVerifyFinish({
        verificationType: 'email-otp',
        identifierType: 'email',
        code: code,
        isNewDevice: false,
      }),
    );
  }

  async startEmailLinkVerification(): Promise<Result<ProcessResponse, CorbadoError>> {
    return this.wrapWithErr(() =>
      this.#authApi.identifierVerifyStart({
        verificationType: VerificationMethod.EmailLink,
        identifierType: LoginIdentifierType.Email,
      }),
    );
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
    return this.wrapWithErr(() => this.#authApi.identifierVerifyStatus());
  }

  async updateEmail(email: string): Promise<Result<ProcessResponse, CorbadoError>> {
    return this.wrapWithErr(() =>
      this.#authApi.identifierUpdate({
        identifierType: 'email',
        value: email,
      }),
    );
  }

  async updatePhone(phone: string): Promise<Result<ProcessResponse, CorbadoError>> {
    return this.wrapWithErr(() =>
      this.#authApi.identifierUpdate({
        identifierType: 'phone',
        value: phone,
      }),
    );
  }

  async updateUsername(username: string): Promise<Result<ProcessResponse, CorbadoError>> {
    return this.wrapWithErr(() =>
      this.#authApi.identifierUpdate({
        identifierType: 'username',
        value: username,
      }),
    );
  }

  async startPhoneOtpVerification(): Promise<Result<ProcessResponse, CorbadoError>> {
    return this.wrapWithErr(() =>
      this.#authApi.identifierVerifyStart({
        verificationType: 'phone-otp',
        identifierType: 'phone',
      }),
    );
  }

  async finishPhoneOtpVerification(code: string): Promise<Result<ProcessResponse, CorbadoError>> {
    return this.wrapWithErr(() =>
      this.#authApi.identifierVerifyFinish({
        verificationType: 'phone-otp',
        identifierType: 'phone',
        code: code,
        isNewDevice: false,
      }),
    );
  }

  async startSocialVerification(
    providerType: SocialProviderType,
    redirectUrl: string,
    authType: AuthType,
  ): Promise<Result<ProcessResponse, CorbadoError> | null> {
    const res = await this.wrapWithErr(() =>
      this.#authApi.socialVerifyStart({
        providerType: providerType,
        redirectUrl: redirectUrl,
        authType: authType,
      }),
    );

    // redirects must be done carefully => we don't want to trigger that redirect during the usual process update cycle but immediately after we received a response from the backend
    if (
      res.ok &&
      res.val.blockBody.data.socialData &&
      res.val.blockBody.data.socialData.status === SocialDataStatusEnum.Started &&
      res.val.blockBody.data.socialData.oauthUrl
    ) {
      window.location.href = res.val.blockBody.data.socialData.oauthUrl;

      return null;
    }

    return res;
  }

  finishSocialVerification(abortController: AbortController): Promise<Result<ProcessResponse, CorbadoError>> {
    return this.wrapWithErr(() => this.#authApi.socialVerifyFinish({}, { signal: abortController.signal }));
  }

  async appendPasskey(maybeAbortController?: AbortController): Promise<Result<ProcessResponse, CorbadoError>> {
    const respStart = await this.startPasskeyAppend();
    if (respStart.err) {
      return respStart;
    }

    if (respStart.val.blockBody.error) {
      return respStart;
    }

    const abortController = maybeAbortController ?? new AbortController();
    const signedChallenge = await this.#webAuthnService.createPasskey(
      respStart.val.blockBody.data.challenge,
      abortController,
    );
    if (signedChallenge.err) {
      // TODO: return block body with client generated error
      return signedChallenge;
    }

    return await this.finishPasskeyAppend(signedChallenge.val);
  }

  async loginWithPasskey(maybeAbortController?: AbortController): Promise<Result<ProcessResponse, CorbadoError>> {
    const respStart = await this.startPasskeyLogin();
    if (respStart.err) {
      return respStart;
    }

    if (respStart.val.blockBody.error) {
      return respStart;
    }

    const abortController = maybeAbortController ?? new AbortController();
    const signedChallenge = await this.#webAuthnService.login(
      respStart.val.blockBody.data.challenge,
      abortController,
      false,
    );
    if (signedChallenge.err) {
      // TODO: return block body with client generated error
      return signedChallenge;
    }

    return await this.finishPasskeyLogin(signedChallenge.val);
  }

  async loginWithPasskeyChallenge(
    challenge: string,
    abortController: AbortController,
  ): Promise<Result<ProcessResponse, CorbadoError>> {
    const signedChallenge = await this.#webAuthnService.login(challenge, abortController, true);
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

  #getDefaultFrontendApiUrl() {
    return `https://${this.#projectId}.${this.#frontendApiUrlSuffix}`;
  }
}

// returns true if the current process does not contain any meaningful data any can thus be reset to a new process
function isProcessInitial(process: ProcessResponse): boolean {
  switch (process.blockBody.block) {
    case BlockType.LoginInit: {
      const identifiersExist = process.blockBody.data.identifierValue.length === 0;
      const socialInProgress = process.blockBody.data.socialData.status !== SocialDataStatusEnum.Initial;

      return !identifiersExist && !socialInProgress;
    }
    case BlockType.SignupInit: {
      const identifiersExist = process.blockBody.data.identifiers.reduce(
        (acc, curr) => acc || curr.identifier.length === 0,
        false,
      );
      const socialInProgress = process.blockBody.data.socialData.status !== SocialDataStatusEnum.Initial;
      console.log('identifiersExist', identifiersExist, process.blockBody.data.identifiers);
      return !identifiersExist && !socialInProgress;
    }
    default:
      return false;
  }
}
