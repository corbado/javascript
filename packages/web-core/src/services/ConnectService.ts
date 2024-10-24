import FingerprintJS from '@fingerprintjs/fingerprintjs';
import type { AxiosHeaders, AxiosInstance, HeadersDefaults, RawAxiosRequestHeaders } from 'axios';
import axios, { type AxiosError, type AxiosResponse } from 'axios';
import log from 'loglevel';
import type { Result } from 'ts-results';
import { Err, Ok } from 'ts-results';

import { Configuration } from '../api/v1';
import type {
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
import type { AuthProcess } from '../models/authProcess';
import { ConnectFlags } from '../models/connect/connectFlags';
import { ConnectInvitation } from '../models/connect/connectInvitation';
import { ConnectLastLogin } from '../models/connect/connectLastLogin';
import { ConnectProcess } from '../models/connect/connectProcess';
import type { ConnectAppendInitData, ConnectLoginInitData, ConnectManageInitData } from '../models/connect/login';
import type { PasskeyLoginSource } from '../utils';
import { CorbadoError } from '../utils';
import { WebAuthnService } from './WebAuthnService';

const packageVersion = process.env.FE_LIBRARY_VERSION;

export class ConnectService {
  #connectApi: CorbadoConnectApi = new CorbadoConnectApi();
  #webAuthnService: WebAuthnService;

  // Private fields for project ID and default timeout for API calls.
  #projectId: string;
  #timeout: number;
  readonly #frontendApiUrlSuffix: string;
  #visitorId: string;

  constructor(projectId: string, frontendApiUrlSuffix: string, isDebug: boolean) {
    this.#projectId = projectId;
    this.#timeout = 5 * 1000;
    this.#frontendApiUrlSuffix = frontendApiUrlSuffix;
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

    // We transform AxiosErrors into CorbadoErrors using axios interceptors.
    out.interceptors.response.use(
      response => response,
      (error: AxiosError) => {
        const e = CorbadoError.fromConnectAxiosError(error);
        log.debug('axios error', error, e);
        return Promise.reject(e);
      },
    );

    return out;
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

    this.#connectApi = new CorbadoConnectApi(config, frontendApiUrl, axiosInstance);
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

  async loginInit(abortController: AbortController): Promise<Result<ConnectLoginInitData, CorbadoError>> {
    const existingProcess = ConnectProcess.loadFromStorage(this.#projectId);
    if (existingProcess) {
      log.debug('process exists, preparing api clients');
      this.#setApisV2(existingProcess);

      // process has already been initialized
      if (existingProcess?.loginData) {
        return Ok(existingProcess.loginData);
      }
    }

    const { req, flags } = await this.#getInitReq();
    const res = await this.wrapWithErr(() =>
      this.#connectApi.connectLoginInit(req, { signal: abortController.signal }),
    );

    if (res.err) {
      return res;
    }

    // if the backend decides that a new client handle is needed, we store it in local storage
    if (res.val.newClientEnvHandle) {
      WebAuthnService.setClientHandle(res.val.newClientEnvHandle);
    }

    flags.addItemsObject(res.val.flags);

    const loginData: ConnectLoginInitData = {
      loginAllowed: res.val.loginAllowed,
      conditionalUIChallenge: res.val.conditionalUIChallenge ?? null,
      flags: flags.getItemsObject(),
    };

    // update local state
    const newProcess = new ConnectProcess(
      res.val.token,
      this.#projectId,
      res.val.expiresAt,
      res.val.frontendApiUrl,
      loginData,
      null,
      null,
    );
    this.#setApisV2(newProcess);
    newProcess.persistToStorage();

    // persist flags
    flags.persistToStorage(this.#projectId);

    return Ok(loginData);
  }

  async #getExistingProcess(generator: () => Promise<Result<unknown, CorbadoError>>): Promise<ConnectProcess | null> {
    const existingProcess = ConnectProcess.loadFromStorage(this.#projectId);
    if (existingProcess) {
      log.debug('process found', existingProcess.expiresAt);
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
  ): Promise<Result<ConnectLoginStartRsp, CorbadoError>> {
    const existingProcess = await this.#getExistingProcess(() => this.loginInit(ac ?? new AbortController()));
    if (!existingProcess) {
      return Err(CorbadoError.missingInit());
    }

    const res = await this.wrapWithErr(() =>
      this.#connectApi.connectLoginStart(
        {
          identifier,
          source: source as ConnectLoginStartReqSourceEnum,
          loadedMs,
          loginConnectToken: connectToken,
        },
        { signal: ac?.signal },
      ),
    );
    if (res.err) {
      ConnectLastLogin.clearStorage(this.#projectId);
      return res;
    }

    if (!res.val.assertionOptions) {
      ConnectLastLogin.clearStorage(this.#projectId);
      return Err(CorbadoError.noPasskeyAvailable());
    }

    return res;
  }

  async loginContinue(start: ConnectLoginStartRsp): Promise<Result<ConnectLoginFinishRsp, CorbadoError>> {
    const res = await this.#webAuthnService.login(start.assertionOptions, false);
    if (res.err) {
      ConnectLastLogin.clearStorage(this.#projectId);
      return res;
    }

    return this.#loginFinish(res.val, false);
  }

  async conditionalUILogin(
    preWebAuthn: (ac: AbortController) => void,
    postWebAuthn: () => void,
    onLoginEnd: () => void,
  ): Promise<Result<ConnectLoginFinishRsp, CorbadoError>> {
    const existingProcess = await this.#getExistingProcess(() => this.loginInit(new AbortController()));
    if (!existingProcess) {
      return Err(CorbadoError.missingInit());
    }

    if (!existingProcess.loginData || existingProcess.loginData?.conditionalUIChallenge === null) {
      return Err(CorbadoError.missingInit());
    }

    const challenge = existingProcess.loginData?.conditionalUIChallenge;

    const res = await this.#webAuthnService.login(challenge, true, preWebAuthn);
    if (res.err) {
      return res;
    }

    postWebAuthn();
    const loginFinishResp = await this.#loginFinish(res.val, true);
    onLoginEnd();

    return loginFinishResp;
  }

  async appendInit(abortController: AbortController): Promise<Result<ConnectAppendInitData, CorbadoError>> {
    const existingProcess = ConnectProcess.loadFromStorage(this.#projectId);
    if (existingProcess) {
      log.debug('process exists, preparing api clients');
      this.#setApisV2(existingProcess);

      // process has already been initialized
      if (existingProcess?.appendData) {
        return Ok(existingProcess.appendData);
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
      WebAuthnService.setClientHandle(res.val.newClientEnvHandle);
    }

    flags.addItemsObject(res.val.flags);

    const appendData: ConnectAppendInitData = {
      appendAllowed: res.val.appendAllowed,
      flags: flags.getItemsObject(),
    };

    // update local state with process
    if (existingProcess) {
      const p = existingProcess.copyWithAppendData(appendData, res.val.expiresAt);
      p.persistToStorage();
    } else {
      const newProcess = new ConnectProcess(
        res.val.processID,
        this.#projectId,
        res.val.expiresAt,
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

  async append(appendTokenValue: string, loadedMs: number): Promise<Result<ConnectAppendFinishRsp, CorbadoError>> {
    const existingProcess = await this.#getExistingProcess(() => this.appendInit(new AbortController()));
    if (!existingProcess) {
      return Err(CorbadoError.missingInit());
    }

    const resStart = await this.wrapWithErr(() =>
      this.#connectApi.connectAppendStart({ appendTokenValue: appendTokenValue, loadedMs }),
    );
    if (resStart.err) {
      return resStart;
    }

    const platformRes = await this.#webAuthnService.createPasskey(resStart.val.attestationOptions);
    if (platformRes.err) {
      return platformRes;
    }

    return this.wrapWithErr(() => this.#connectApi.connectAppendFinish({ attestationResponse: platformRes.val }));
  }

  async startAppend(
    appendTokenValue: string,
    loadedMs: number,
    abortController?: AbortController,
    initiatedByUser?: boolean,
  ): Promise<Result<ConnectAppendStartRsp, CorbadoError>> {
    const existingProcess = await this.#getExistingProcess(() => this.appendInit(new AbortController()));
    if (!existingProcess) {
      return Err(CorbadoError.missingInit());
    }

    return this.wrapWithErr(() =>
      this.#connectApi.connectAppendStart(
        { appendTokenValue: appendTokenValue, forcePasskeyAppend: initiatedByUser, loadedMs },
        abortController && { signal: abortController.signal },
      ),
    );
  }

  async completeAppend(attestationOptions: string): Promise<Result<ConnectAppendFinishRsp, CorbadoError>> {
    const existingProcess = await this.#getExistingProcess(() => this.appendInit(new AbortController()));
    if (!existingProcess) {
      return Err(CorbadoError.missingInit());
    }

    const res = await this.#webAuthnService.createPasskey(attestationOptions);
    if (res.err) {
      return res;
    }

    const finishRes = await this.wrapWithErr(() =>
      this.#connectApi.connectAppendFinish({ attestationResponse: res.val }),
    );
    if (finishRes.ok) {
      const latestLogin = new ConnectLastLogin(finishRes.val.passkeyOperation);
      latestLogin.persistToStorage(this.#projectId);
    }

    return finishRes;
  }

  dispose() {
    this.#webAuthnService.abortOngoingOperation();
  }

  async #loginFinish(
    assertionResponse: string,
    isConditionalUI: boolean,
  ): Promise<Result<ConnectLoginFinishRsp, CorbadoError>> {
    const existingProcess = await this.#getExistingProcess(() => this.loginInit(new AbortController()));
    if (!existingProcess) {
      return Err(CorbadoError.missingInit());
    }

    const res = await this.wrapWithErr(() =>
      this.#connectApi.connectLoginFinish({ assertionResponse, isConditionalUI }, { timeout: 8 * 1000 }),
    );

    if (isConditionalUI) {
      existingProcess.resetLoginData().persistToStorage();
    }

    if (res.ok) {
      const latestLogin = new ConnectLastLogin(res.val.passkeyOperation);
      latestLogin.persistToStorage(this.#projectId);
    }

    return res;
  }

  async manageInit(abortController: AbortController): Promise<Result<ConnectManageInitData, CorbadoError>> {
    const existingProcess = ConnectProcess.loadFromStorage(this.#projectId);
    if (existingProcess) {
      log.debug('process exists, preparing api clients');
      this.#setApisV2(existingProcess);

      // process has already been initialized
      if (existingProcess?.manageData) {
        return Ok(existingProcess.manageData);
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
      WebAuthnService.setClientHandle(res.val.newClientEnvHandle);
    }

    flags.addItemsObject(res.val.flags);

    const manageData: ConnectManageInitData = {
      manageAllowed: res.val.manageAllowed,
      flags: flags.getItemsObject(),
    };

    // update local state with process
    if (existingProcess) {
      const p = existingProcess.copyWithManageData(manageData, res.val.expiresAt);
      p.persistToStorage();
    } else {
      const newProcess = new ConnectProcess(
        res.val.processID,
        this.#projectId,
        res.val.expiresAt,
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

  async manageList(passkeyListToken: string): Promise<Result<ConnectManageListRsp, CorbadoError>> {
    const existingProcess = await this.#getExistingProcess(() => this.manageInit(new AbortController()));
    if (!existingProcess) {
      return Err(CorbadoError.missingInit());
    }

    const req: ConnectManageListReq = {
      connectToken: passkeyListToken,
    };

    return this.wrapWithErr(() => this.#connectApi.connectManageList(req));
  }

  async manageDelete(
    passkeyDeleteToken: string,
    credentialID: string,
  ): Promise<Result<ConnectManageDeleteRsp, CorbadoError>> {
    const existingProcess = await this.#getExistingProcess(() => this.manageInit(new AbortController()));
    if (!existingProcess) {
      return Err(CorbadoError.missingInit());
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

  recordEventLoginError() {
    return this.#recordEvent(PasskeyEventType.LoginError);
  }

  recordEventLoginExplicitAbort() {
    return this.#recordEvent(PasskeyEventType.LoginExplicitAbort);
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

  recordEventAppendCredentialExistsError() {
    return this.#recordEvent(PasskeyEventType.AppendCredentialExists);
  }

  recordEventAppendError() {
    return this.#recordEvent(PasskeyEventType.AppendError);
  }

  recordEventAppendExplicitAbort() {
    return this.#recordEvent(PasskeyEventType.AppendExplicitAbort);
  }

  // This function can be used to catch events that would usually not create backend interaction (e.g. when a passkey ceremony is canceled)
  #recordEvent(eventType: PasskeyEventType) {
    const existingProcess = ConnectProcess.loadFromStorage(this.#projectId);
    if (!existingProcess) {
      log.warn('No process found to record event.');

      return;
    }

    const req: ConnectEventCreateReq = {
      eventType,
    };

    return this.wrapWithErr(() => this.#connectApi.connectEventCreate(req));
  }

  #getDefaultFrontendApiUrl() {
    return `https://${this.#projectId}.${this.#frontendApiUrlSuffix}`;
  }

  getLastLogin() {
    return ConnectLastLogin.loadFromStorage(this.#projectId);
  }

  clearLastLogin() {
    ConnectLastLogin.clearStorage(this.#projectId);
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
    const clientInformation = await this.#webAuthnService.getClientInformation();
    const invitationToken = ConnectInvitation.loadFromStorage()?.token;

    const req = {
      clientInformation: clientInformation,
      flags: flags.getItemsObject(),
      invitationToken: invitationToken,
    } as T;

    return { req, flags };
  }
}
