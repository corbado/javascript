import FingerprintJS from '@fingerprintjs/fingerprintjs';
import type {
  AxiosHeaders,
  AxiosInstance,
  HeadersDefaults,
  InternalAxiosRequestConfig,
  RawAxiosRequestHeaders,
} from 'axios';
import axios, { type AxiosError, type AxiosResponse } from 'axios';
import log from 'loglevel';
import type { Result } from 'ts-results';
import { Err, Ok } from 'ts-results';

import { Configuration } from '../api/v1';
import type {
  ClientStateMeta,
  ConnectAppendFinishRsp,
  ConnectAppendInitReq,
  ConnectAppendStartRsp,
  ConnectEventCreateReq,
  ConnectLoginFinishRsp,
  ConnectLoginInitReq,
  ConnectLoginStartReqSourceEnum,
  ConnectLoginStartRsp,
  ConnectManageDeleteReq,
  ConnectManageDeleteRsp,
  ConnectManageInitReq,
  ConnectManageListReq,
  ConnectManageListRsp,
} from '../api/v2';
import { CorbadoConnectApi, PasskeyEventType } from '../api/v2';
import type { AppendCompletionType } from '../models/connect/append';
import { ConnectFlags } from '../models/connect/connectFlags';
import { ConnectInvitation } from '../models/connect/connectInvitation';
import { ConnectProcess } from '../models/connect/connectProcess';
import type { ConnectAppendInitData, ConnectLoginInitData, ConnectManageInitData } from '../models/connect/login';
import type { PasskeyLoginSource } from '../utils';
import { ConnectError, ConnectErrorType } from '../utils';
import type { LastLogin } from './ClientStateService';
import { ClientStateService } from './ClientStateService';
import { WebAuthnService } from './WebAuthnService';

const packageVersion = process.env.FE_LIBRARY_VERSION;

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  metadata?: {
    startTime?: number;
  };
}

export class ConnectService {
  #connectApi: CorbadoConnectApi = new CorbadoConnectApi();
  #webAuthnService: WebAuthnService;

  // Private fields for project ID and default timeout for API calls.
  #projectId: string;
  #timeout: number;
  readonly #frontendApiUrlSuffix: string;
  readonly #customDomain: string | undefined;
  #visitorId: string;

  constructor(projectId: string, frontendApiUrlSuffix: string, isDebug: boolean, customDomain?: string) {
    this.#projectId = projectId;
    this.#timeout = 10 * 1000;
    this.#frontendApiUrlSuffix = frontendApiUrlSuffix;
    this.#customDomain = customDomain;
    this.#webAuthnService = new WebAuthnService();
    this.#visitorId = '';

    // Initializes the API instances with no authentication token.
    // Authentication tokens are set in the SessionService.
    this.#setApisV2();

    if (isDebug) {
      log.setLevel('debug');
    } else {
      log.setLevel('error');
    }
  }

  #createAxiosInstanceV2(processId: string): AxiosInstance {
    const corbadoVersion = {
      name: 'web-core',
      sdkVersion: packageVersion,
    };

    const headers: RawAxiosRequestHeaders | AxiosHeaders | Partial<HeadersDefaults> = {
      'Content-Type': 'application/json',
      'X-Corbado-SDK': JSON.stringify(corbadoVersion),
      'X-Corbado-Client-Timezone': Intl.DateTimeFormat().resolvedOptions().timeZone,
    };

    const out = axios.create({
      timeout: this.#timeout,
      withCredentials: true,
      headers: processId ? { ...headers, 'x-corbado-process-id': processId } : headers,
    });

    out.interceptors.request.use(
      (config: CustomAxiosRequestConfig): CustomAxiosRequestConfig | Promise<CustomAxiosRequestConfig> => {
        config.metadata = config.metadata || {};
        config.metadata.startTime = Date.now();
        return config;
      },
      error => {
        log.debug('axios request config error', error);
        return Promise.reject(error);
      },
    );

    // We transform AxiosErrors into ConnectErrors using axios interceptors.
    out.interceptors.response.use(
      response => response,
      (error: AxiosError) => {
        const endTime = Date.now(); // Or performance.now()
        let durationMs = 0;
        const config = error.config as CustomAxiosRequestConfig | undefined; // Cast config
        const startTime = config?.metadata?.startTime;

        if (startTime) {
          durationMs = endTime - startTime;
        }

        const e = ConnectError.fromConnectAxiosError(error, durationMs);
        log.debug('axios error', error, e);
        return Promise.reject(e);
      },
    );

    return out;
  }

  #setApisV2(process?: ConnectProcess): void {
    let frontendApiUrl = this.#getDefaultFrontendApiUrl();
    if (this.#customDomain && this.#customDomain.length > 0) {
      frontendApiUrl = this.#customDomain;
    } else if (process?.frontendApiUrl && process?.frontendApiUrl.length > 0) {
      frontendApiUrl = process.frontendApiUrl;
    }

    const config = new Configuration({
      apiKey: this.#projectId,
      basePath: frontendApiUrl,
    });
    const axiosInstance = this.#createAxiosInstanceV2(process?.id ?? '');

    this.#connectApi = new CorbadoConnectApi(config, frontendApiUrl, axiosInstance);
  }

  async wrapWithErr<T>(callback: () => Promise<AxiosResponse<T>>): Promise<Result<T, ConnectError>> {
    const started = Date.now();
    try {
      const r = await callback();

      return Ok(r.data);
    } catch (e) {
      const runtime = Date.now() - started;
      return Err(ConnectError.fromFrontendError(e, runtime));
    }
  }

  async loginInit(abortController: AbortController): Promise<Result<ConnectLoginInitData, ConnectError>> {
    const existingProcess = ConnectProcess.loadFromStorage(this.#projectId);
    const maybeLoginData = existingProcess?.getValidLoginData();
    if (
      existingProcess &&
      maybeLoginData &&
      !maybeLoginData.loginAllowed &&
      ConnectInvitation.loadFromStorage()?.token
    ) {
      existingProcess.resetLoginData().persistToStorage();
    } else if (existingProcess) {
      log.debug('process exists, preparing api clients');
      this.#setApisV2(existingProcess);

      // process has already been initialized
      if (maybeLoginData) {
        return Ok(maybeLoginData);
      }
    }

    const { req, flags } = await this.#getInitReq();
    const res = await this.wrapWithErr(() =>
      this.#connectApi.connectLoginInit(req, { signal: abortController.signal, timeout: 10 * 1000 }),
    );

    if (res.err) {
      return res;
    }

    const existingProcessFromOtherLoginInit = ConnectProcess.loadFromStorage(this.#projectId);
    const maybeExistingLoginDataFromOtherLoginInit = existingProcessFromOtherLoginInit?.getValidLoginData();
    if (maybeExistingLoginDataFromOtherLoginInit) {
      if (res.val.token !== existingProcessFromOtherLoginInit?.id) {
        await this.#connectApi.connectProcessClear({ processId: res.val.token });
      }

      log.debug('process exists (after login init attempt');
      this.#setApisV2(existingProcessFromOtherLoginInit);

      return Ok(maybeExistingLoginDataFromOtherLoginInit);
    }

    // if the backend decides that a new client handle is needed, we store it in local storage
    if (res.val.newClientEnvHandle) {
      ClientStateService.setClientEnvHandle(this.#projectId, res.val.newClientEnvHandle);
    }

    if (res.val.newClientState) {
      ClientStateService.enrichFromURL(this.#projectId, res.val.newClientState);
    }

    flags.addItemsObject(res.val.flags);

    const loginData: ConnectLoginInitData = {
      loginAllowed: res.val.loginAllowed,
      conditionalUIChallenge: res.val.conditionalUIChallenge ?? null,
      flags: flags.getItemsObject(),
      expiresAt: res.val.expiresAt,
    };

    if (existingProcess && existingProcess.id === res.val.token) {
      log.debug('process exists, updating login data', loginData);
      const p = existingProcess.copyWithLoginData(loginData);
      p.persistToStorage();
    } else {
      log.debug('creating new process', loginData);
      const newProcess = new ConnectProcess(
        res.val.token,
        this.#projectId,
        res.val.frontendApiUrl,
        loginData,
        null,
        null,
      );
      this.#setApisV2(newProcess);
      newProcess.persistToStorage();
    }

    // persist flags
    flags.persistToStorage(this.#projectId);

    return Ok(loginData);
  }

  async #getExistingProcess(generator: () => Promise<Result<unknown, ConnectError>>): Promise<ConnectProcess | null> {
    const existingProcess = ConnectProcess.loadFromStorage(this.#projectId);
    if (existingProcess) {
      log.debug('process found');
      return existingProcess;
    }

    log.debug('process not found, trying to reinitialize');
    const generatorResult = await generator();
    const newProcess = ConnectProcess.loadFromStorage(this.#projectId);
    if (generatorResult.err || !newProcess) {
      return null;
    }

    return newProcess;
  }

  async loginStart(
    identifier: string,
    source: PasskeyLoginSource,
    loadedMs: number,
    connectToken?: string,
    ac?: AbortController,
  ): Promise<Result<ConnectLoginStartRsp, ConnectError>> {
    const existingProcess = await this.loginInit(ac ?? new AbortController());
    if (existingProcess.err) {
      return Err(new ConnectError(ConnectErrorType.MissingInit));
    }

    let identifierHintAvailable = false;
    if (localStorage.getItem('vicroads_login_user_email_personal')) {
      identifierHintAvailable = true;
    }

    let oneTapMeta: ClientStateMeta | undefined;
    const lastLogin = ClientStateService.getLastLogin(this.#projectId);
    if (lastLogin) {
      oneTapMeta = {
        source: ClientStateService.parseClientStateSource(lastLogin.source),
        ts: lastLogin.ts,
      };
    }

    const res = await this.wrapWithErr(() =>
      this.#connectApi.connectLoginStart(
        {
          identifier,
          source: source as ConnectLoginStartReqSourceEnum,
          loadedMs,
          loginConnectToken: connectToken,
          identifierHintAvailable: identifierHintAvailable,
          oneTapMeta: oneTapMeta,
        },
        { signal: ac?.signal },
      ),
    );
    if (res.err) {
      this.clearLastLogin();
      return res;
    }

    if (!res.val.assertionOptions) {
      this.clearLastLogin();
    }

    return res;
  }

  async loginContinue(start: ConnectLoginStartRsp): Promise<Result<ConnectLoginFinishRsp, ConnectError>> {
    const res = await this.#webAuthnLogin(start.assertionOptions, false);
    if (res.err) {
      this.clearLastLogin();
      return res;
    }

    return this.#loginFinish(res.val, false);
  }

  async conditionalUILogin(
    preWebAuthn: (ac: AbortController) => void,
    postWebAuthn: () => void,
    onLoginEnd: () => void,
    loadedMs: number,
  ): Promise<Result<ConnectLoginFinishRsp, ConnectError>> {
    const existingProcess = await this.#getExistingProcess(() => this.loginInit(new AbortController()));
    if (!existingProcess) {
      return Err(new ConnectError(ConnectErrorType.MissingInit));
    }

    if (!existingProcess.loginData || existingProcess.loginData?.conditionalUIChallenge === null) {
      return Err(new ConnectError(ConnectErrorType.MissingInit));
    }

    const challenge = existingProcess.loginData?.conditionalUIChallenge;

    const res = await this.#webAuthnLogin(challenge, true, preWebAuthn);
    if (res.err) {
      return res;
    }

    postWebAuthn();
    const loginFinishResp = await this.#loginFinish(res.val, true, loadedMs);
    onLoginEnd();

    return loginFinishResp;
  }

  async appendInit(abortController: AbortController): Promise<Result<ConnectAppendInitData, ConnectError>> {
    const existingProcess = ConnectProcess.loadFromStorage(this.#projectId);
    if (existingProcess) {
      log.debug('process exists, preparing api clients');
      this.#setApisV2(existingProcess);

      // process has already been initialized
      const maybeAppendData = existingProcess?.getValidAppendData();
      if (maybeAppendData) {
        return Ok(maybeAppendData);
      }
    }

    const { req, flags } = await this.#getInitReq();
    const res = await this.wrapWithErr(() =>
      this.#connectApi.connectAppendInit(req, { signal: abortController.signal }),
    );

    if (res.err) {
      return res;
    }

    // if the backend decides that a new client handle is needed, we store it in local storage
    if (res.val.newClientEnvHandle) {
      ClientStateService.setClientEnvHandle(this.#projectId, res.val.newClientEnvHandle);
    }

    if (res.val.newClientState) {
      ClientStateService.enrichFromURL(this.#projectId, res.val.newClientState);
    }

    flags.addItemsObject(res.val.flags);

    const appendData: ConnectAppendInitData = {
      appendAllowed: res.val.appendAllowed,
      flags: flags.getItemsObject(),
      expiresAt: res.val.expiresAt,
    };

    // update local state with process
    if (existingProcess && existingProcess.id === res.val.processID) {
      log.debug('process exists, updating append data', appendData);
      const p = existingProcess.copyWithAppendData(appendData);
      p.persistToStorage();
    } else {
      log.debug('creating new process', appendData);
      const newProcess = new ConnectProcess(
        res.val.processID,
        this.#projectId,
        res.val.frontendApiUrl,
        null,
        appendData,
        null,
      );
      this.#setApisV2(newProcess);
      newProcess.persistToStorage();
    }

    // persist flags
    flags.persistToStorage(this.#projectId);

    return Ok(appendData);
  }

  async startAppend(
    appendTokenValue: string,
    loadedMs: number,
    abortController?: AbortController,
    initiatedByUser?: boolean,
  ): Promise<Result<ConnectAppendStartRsp, ConnectError>> {
    const existingProcess = await this.#getExistingProcess(() => this.appendInit(new AbortController()));
    if (!existingProcess) {
      return Err(new ConnectError(ConnectErrorType.MissingInit));
    }

    return this.wrapWithErr(() =>
      this.#connectApi.connectAppendStart(
        { appendTokenValue: appendTokenValue, forcePasskeyAppend: initiatedByUser, loadedMs },
        abortController && { signal: abortController.signal },
      ),
    );
  }

  async completeAppend(
    attestationOptions: string,
    completionType: AppendCompletionType,
  ): Promise<Result<ConnectAppendFinishRsp, ConnectError>> {
    const existingProcess = await this.#getExistingProcess(() => this.appendInit(new AbortController()));
    if (!existingProcess) {
      return Err(new ConnectError(ConnectErrorType.MissingInit));
    }

    const conditional = completionType === 'conditional';
    const res = await this.#webAuthnCreatePasskey(attestationOptions, conditional);
    if (res.err) {
      return res;
    }

    const finishRes = await this.wrapWithErr(() =>
      this.#connectApi.connectAppendFinish({ attestationResponse: res.val, completionType }),
    );
    if (finishRes.ok) {
      const latestLogin = finishRes.val.passkeyOperation as LastLogin;
      ClientStateService.setLastLogin(this.#projectId, latestLogin);
    }

    return finishRes;
  }

  dispose() {
    this.#webAuthnService.abortOngoingOperation();
  }

  async #loginFinish(
    assertionResponse: string,
    isConditionalUI: boolean,
    loadedMs?: number,
  ): Promise<Result<ConnectLoginFinishRsp, ConnectError>> {
    const existingProcess = await this.#getExistingProcess(() => this.loginInit(new AbortController()));
    if (!existingProcess) {
      return Err(new ConnectError(ConnectErrorType.MissingInit));
    }

    const res = await this.wrapWithErr(() =>
      this.#connectApi.connectLoginFinish({ assertionResponse, isConditionalUI, loadedMs }, { timeout: 15 * 1000 }),
    );

    if (isConditionalUI) {
      existingProcess.resetLoginData().persistToStorage();
    }

    if (res.ok) {
      const latestLogin = res.val.passkeyOperation as LastLogin;
      ClientStateService.setLastLogin(this.#projectId, latestLogin);
    }

    return res;
  }

  async manageInit(abortController: AbortController): Promise<Result<ConnectManageInitData, ConnectError>> {
    const existingProcess = ConnectProcess.loadFromStorage(this.#projectId);
    if (existingProcess) {
      log.debug('process exists, preparing api clients');
      this.#setApisV2(existingProcess);

      // process has already been initialized
      const maybeManageData = existingProcess?.getValidManageData();
      if (maybeManageData) {
        return Ok(maybeManageData);
      }
    }

    const { req, flags } = await this.#getInitReq();
    const res = await this.wrapWithErr(() =>
      this.#connectApi.connectManageInit(req, { signal: abortController.signal }),
    );

    if (res.err) {
      return res;
    }

    // if the backend decides that a new client handle is needed, we store it in local storage
    if (res.val.newClientEnvHandle) {
      ClientStateService.setClientEnvHandle(this.#projectId, res.val.newClientEnvHandle);
    }

    flags.addItemsObject(res.val.flags);

    const manageData: ConnectManageInitData = {
      manageAllowed: res.val.manageAllowed,
      flags: flags.getItemsObject(),
      expiresAt: res.val.expiresAt,
    };

    // update local state with process
    if (existingProcess && existingProcess.id === res.val.processID) {
      const p = existingProcess.copyWithManageData(manageData);
      p.persistToStorage();
    } else {
      const newProcess = new ConnectProcess(
        res.val.processID,
        this.#projectId,
        res.val.frontendApiUrl,
        null,
        null,
        manageData,
      );
      this.#setApisV2(newProcess);
      newProcess.persistToStorage();
    }

    // persist flags
    flags.persistToStorage(this.#projectId);

    return Ok(manageData);
  }

  async manageList(
    passkeyListToken: string,
    triggerSignalAllAccepted: boolean,
  ): Promise<Result<ConnectManageListRsp, ConnectError>> {
    const existingProcess = await this.#getExistingProcess(() => this.manageInit(new AbortController()));
    if (!existingProcess) {
      return Err(new ConnectError(ConnectErrorType.MissingInit));
    }

    const req: ConnectManageListReq = {
      connectToken: passkeyListToken,
    };

    const out = await this.wrapWithErr(() => this.#connectApi.connectManageList(req));
    if (out.err) {
      return out;
    }

    // self-healing mechanism: if a user has no passkeys, we clear the last login
    if (out.val.passkeys.length === 0) {
      this.clearLastLogin();
    }

    if (triggerSignalAllAccepted) {
      const credentialIDs = out.val.passkeys.map(pk => pk.credentialID);
      await WebAuthnService.signalAllAcceptedCredentials(out.val.rpID, out.val.userID, credentialIDs);
    }

    return out;
  }

  async manageDelete(
    passkeyDeleteToken: string,
    credentialID: string,
  ): Promise<Result<ConnectManageDeleteRsp, ConnectError>> {
    const existingProcess = await this.#getExistingProcess(() => this.manageInit(new AbortController()));
    if (!existingProcess) {
      return Err(new ConnectError(ConnectErrorType.MissingInit));
    }

    const req: ConnectManageDeleteReq = {
      connectToken: passkeyDeleteToken,
      credentialID,
    };

    return this.wrapWithErr(() => this.#connectApi.connectManageDelete(req));
  }

  setInvitation(token: string) {
    const invitation = new ConnectInvitation(token);
    invitation.persistToStorage();
  }

  handleNa() {
    const storedNa = localStorage.getItem('na_ipr');
    if (storedNa) {
      const parsed = parseInt(storedNa);
      if (Date.now() < parsed + 1000 * 60) {
        return;
      }

      localStorage.removeItem('na_ipr');
    }

    localStorage.setItem('na_ipr', Date.now().toString());
    location.reload();
  }

  recordEventLoginError(messageCode: string) {
    return this.#recordEvent(PasskeyEventType.LoginError, messageCode);
  }

  recordEventLoginExplicitAbort(assertionOptions?: string) {
    let challenge;
    if (assertionOptions) {
      challenge = WebAuthnService.challengeFromAssertionOptions(assertionOptions);
    }

    return this.#recordEvent(PasskeyEventType.LoginExplicitAbort, undefined, challenge);
  }

  recordEventLoginOneTapSwitch() {
    return this.#recordEvent(PasskeyEventType.LoginOneTapSwitch);
  }

  recordEventLoginErrorUntyped() {
    return this.#recordEvent(PasskeyEventType.LoginErrorUntyped);
  }

  recordEventUserAppendAfterCrossPlatformBlacklisted() {
    return this.#recordEvent(PasskeyEventType.UserAppendAfterCrossPlatformBlacklisted);
  }

  recordEventUserAppendAfterLoginErrorBlacklisted() {
    return this.#recordEvent(PasskeyEventType.UserAppendAfterLoginErrorBlacklisted);
  }

  recordEventAppendCredentialExistsError(messageCode: string, attestationOptions: string) {
    let challenge;
    if (attestationOptions) {
      challenge = WebAuthnService.challengeFromAttestationOptions(attestationOptions);
    }

    return this.#recordEvent(PasskeyEventType.AppendCredentialExists, messageCode, challenge);
  }

  recordEventAppendError() {
    return this.#recordEvent(PasskeyEventType.AppendError);
  }

  recordEventLoginErrorUnexpected(messageCode: string) {
    return this.#recordEvent(PasskeyEventType.LoginErrorUnexpected, messageCode);
  }

  recordEventAppendErrorUnexpected(messageCode: string) {
    return this.#recordEvent(PasskeyEventType.AppendErrorUnexpected, messageCode);
  }

  recordEventManageErrorUnexpected(messageCode: string) {
    return this.#recordEvent(PasskeyEventType.ManageErrorUnexpected, messageCode);
  }

  recordEventAppendExplicitAbort(attestationOptions?: string) {
    let challenge;
    if (attestationOptions) {
      challenge = WebAuthnService.challengeFromAttestationOptions(attestationOptions);
    }

    return this.#recordEvent(PasskeyEventType.AppendExplicitAbort, undefined, challenge);
  }

  recordEventAppendLearnMore() {
    return this.#recordEvent(PasskeyEventType.AppendLearnMore);
  }

  // This function can be used to catch events that would usually not create backend interaction (e.g. when a passkey ceremony is canceled)
  #recordEvent(eventType: PasskeyEventType, message?: string, challenge?: string) {
    const existingProcess = ConnectProcess.loadFromStorage(this.#projectId);
    if (!existingProcess) {
      log.warn('No process found to record event.');

      return;
    }

    const req: ConnectEventCreateReq = {
      eventType,
      message,
      challenge,
    };

    return this.wrapWithErr(() => this.#connectApi.connectEventCreate(req));
  }

  #getDefaultFrontendApiUrl() {
    return `https://${this.#projectId}.${this.#frontendApiUrlSuffix}`;
  }

  getLastLogin() {
    return ClientStateService.getLastLogin(this.#projectId)?.data;
  }

  clearLastLogin() {
    ClientStateService.clearLastLogin(this.#projectId);
  }

  enrichClientState(encoded?: string) {
    if (!encoded) {
      return;
    }

    ClientStateService.enrichFromURL(this.#projectId, encoded);
  }

  encodeClientState(): string {
    return ClientStateService.encodeToURL(this.#projectId);
  }

  async #getInitReq<T extends ConnectAppendInitReq | ConnectLoginInitReq | ConnectManageInitReq>(): Promise<{
    req: T;
    flags: ConnectFlags;
  }> {
    let currentVisitorId = this.#visitorId;

    if (!currentVisitorId) {
      const fpJS = await FingerprintJS.load();
      const { visitorId } = await fpJS.get();

      currentVisitorId = visitorId;
      this.#visitorId = visitorId;
    }

    const flags = ConnectFlags.loadFromStorage(this.#projectId);
    const maybeClientHandle = ClientStateService.getClientEnvHandle(this.#projectId);
    const clientInformation = await this.#webAuthnService.getClientInformation(maybeClientHandle);
    const invitationToken = ConnectInvitation.loadFromStorage()?.token;

    const req = {
      clientInformation: clientInformation,
      flags: flags.getItemsObject(),
      invitationToken: invitationToken,
    } as T;

    return { req, flags };
  }

  async #webAuthnLogin(
    serializedChallenge: string,
    isConditional: boolean,
    onConditionalLoginStart?: (ac: AbortController) => void,
  ): Promise<Result<string, ConnectError>> {
    const started = Date.now();
    try {
      const res = await this.#webAuthnService.loginRaw(serializedChallenge, isConditional, onConditionalLoginStart);
      if (res.message) {
        void this.recordEventLoginErrorUnexpected(res.message);
      }

      return Ok(res.response);
    } catch (e) {
      const runtime = Date.now() - started;
      return Err(ConnectError.fromFrontendError(e, runtime));
    }
  }

  async #webAuthnCreatePasskey(
    serializedChallenge: string,
    conditional: boolean,
  ): Promise<Result<string, ConnectError>> {
    const started = Date.now();
    try {
      const res = await this.#webAuthnService.createPasskeyRaw(serializedChallenge, conditional);
      if (res.message) {
        void this.recordEventAppendErrorUnexpected(res.message);
      }

      return Ok(res.response);
    } catch (e) {
      const runtime = Date.now() - started;
      return Err(ConnectError.fromFrontendError(e, runtime));
    }
  }
}
