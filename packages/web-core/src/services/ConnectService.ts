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
  ConnectLoginFinishRsp,
  ConnectLoginInitReq,
  ConnectManageDeleteReq,
  ConnectManageDeleteRsp,
  ConnectManageInitReq,
  ConnectManageListReq,
  ConnectManageListRsp,
} from '../api/v2';
import { CorbadoConnectApi } from '../api/v2';
import type { AuthProcess } from '../models/authProcess';
import { ConnectFlags } from '../models/connect/connectFlags';
import { ConnectLastLogin } from '../models/connect/connectLastLogin';
import { ConnectProcess } from '../models/connect/connectProcess';
import type { ConnectAppendInitData, ConnectLoginInitData, ConnectManageInitData } from '../models/connect/login';
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

  constructor(projectId: string, frontendApiUrlSuffix: string, isDebug: boolean) {
    this.#projectId = projectId;
    this.#timeout = 30 * 1000;
    this.#frontendApiUrlSuffix = frontendApiUrlSuffix;
    this.#webAuthnService = new WebAuthnService();

    // Initializes the API instances with no authentication token.
    // Authentication tokens are set in the SessionService.
    this.#setApisV2();

    if (isDebug) {
      log.setLevel('debug');
    } else {
      log.setLevel('error');
    }
  }

  clearProcess() {
    return ConnectProcess.clearStorage(this.#projectId);
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

    const out = axios.create({
      timeout: this.#timeout,
      withCredentials: true,
      headers: processId ? { ...headers, 'x-corbado-process-id': processId } : headers,
    });

    // We transform AxiosErrors into CorbadoErrors using axios interceptors.
    out.interceptors.response.use(
      response => response,
      (error: AxiosError) => {
        log.error('axios error', error);
        const e = CorbadoError.fromAxiosError(error);
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
    if (existingProcess?.isValid()) {
      log.debug('process exists, preparing api clients');
      this.#setApisV2(existingProcess);
    }

    // process has already been initialized
    if (existingProcess?.loginData) {
      return Ok(existingProcess.loginData);
    }

    const bluetoothAvailable = await WebAuthnService.canUseBluetooth();
    const canUsePasskeys = await WebAuthnService.doesBrowserSupportPasskeys();
    const javaScriptHighEntropy = await WebAuthnService.getHighEntropyValues();
    const canUseConditionUI = await WebAuthnService.doesBrowserSupportConditionalUI();
    const maybeClientHandle = WebAuthnService.getClientHandle();
    const flags = ConnectFlags.loadFromStorage(this.#projectId);

    const req: ConnectLoginInitReq = {
      clientInformation: {
        bluetoothAvailable: bluetoothAvailable,
        isUserVerifyingPlatformAuthenticatorAvailable: canUsePasskeys,
        isConditionalMediationAvailable: canUseConditionUI,
        clientEnvHandle: maybeClientHandle ?? undefined,
        javaScriptHighEntropy: javaScriptHighEntropy,
      },
      flags: flags.getItemsObject(),
    };

    log.debug('client data', req);

    const res = await this.wrapWithErr(() =>
      this.#connectApi.connectLoginInit(req, { signal: abortController.signal }),
    );
    if (res.err) {
      return res;
    }

    flags.addItemsObject(res.val.flags);

    const loginData: ConnectLoginInitData = {
      loginAllowed: res.val.loginAllowed,
      conditionalUIChallenge: res.val.conditionalUIChallenge ?? null,
      flags: flags.getItemsObject(),
    };

    // update local state
    if (existingProcess) {
      const p = existingProcess.copyWithLoginData(loginData);
      p.persistToStorage();
    } else {
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
    }

    // persist flags
    flags.persistToStorage(this.#projectId);

    return Ok(loginData);
  }

  async login(identifier: string): Promise<Result<ConnectLoginFinishRsp, CorbadoError>> {
    const existingProcess = ConnectProcess.loadFromStorage(this.#projectId);
    if (!existingProcess) {
      return Err(CorbadoError.missingInit());
    }

    const resStart = await this.wrapWithErr(() => this.#connectApi.connectLoginStart({ identifier }));
    if (resStart.err) {
      ConnectLastLogin.clearStorage(this.#projectId);
      return resStart;
    }

    if (!resStart.val.assertionOptions) {
      ConnectLastLogin.clearStorage(this.#projectId);
      return Err(CorbadoError.noPasskeyAvailable());
    }

    const res = await this.#webAuthnService.login(resStart.val.assertionOptions, false, false);
    if (res.err) {
      ConnectLastLogin.clearStorage(this.#projectId);
      return res;
    }

    return this.#loginFinish(res.val, false);
  }

  async conditionalUILogin(): Promise<Result<ConnectLoginFinishRsp, CorbadoError>> {
    const existingProcess = ConnectProcess.loadFromStorage(this.#projectId);
    if (!existingProcess) {
      return Err(CorbadoError.missingInit());
    }

    if (!existingProcess.loginData || existingProcess.loginData?.conditionalUIChallenge === null) {
      return Err(CorbadoError.missingInit());
    }

    const challenge = existingProcess.loginData?.conditionalUIChallenge;
    const res = await this.#webAuthnService.login(challenge, true, false);
    if (res.err) {
      return res;
    }

    return this.#loginFinish(res.val, true);
  }

  async appendInit(abortController: AbortController): Promise<Result<ConnectAppendInitData, CorbadoError>> {
    const existingProcess = ConnectProcess.loadFromStorage(this.#projectId);
    if (existingProcess?.isValid()) {
      log.debug('process exists, preparing api clients');
      this.#setApisV2(existingProcess);
    }

    // process has already been initialized
    if (existingProcess?.appendData) {
      return Ok(existingProcess.appendData);
    }

    const bluetoothAvailable = await WebAuthnService.canUseBluetooth();
    const canUsePasskeys = await WebAuthnService.doesBrowserSupportPasskeys();
    const javaScriptHighEntropy = await WebAuthnService.getHighEntropyValues();
    const canUseConditionUI = await WebAuthnService.doesBrowserSupportConditionalUI();
    const maybeClientHandle = WebAuthnService.getClientHandle();
    const flags = ConnectFlags.loadFromStorage(this.#projectId);

    const req: ConnectAppendInitReq = {
      clientInformation: {
        bluetoothAvailable: bluetoothAvailable,
        isUserVerifyingPlatformAuthenticatorAvailable: canUsePasskeys,
        isConditionalMediationAvailable: canUseConditionUI,
        clientEnvHandle: maybeClientHandle ?? undefined,
        javaScriptHighEntropy: javaScriptHighEntropy,
      },
      flags: flags.getItemsObject(),
    };

    log.debug('client data', req);

    const res = await this.wrapWithErr(() =>
      this.#connectApi.connectAppendInit(req, { signal: abortController.signal }),
    );
    if (res.err) {
      return res;
    }

    flags.addItemsObject(res.val.flags);

    const appendData: ConnectAppendInitData = {
      appendAllowed: res.val.appendAllowed,
      flags: flags.getItemsObject(),
    };

    // update local state with process
    if (existingProcess) {
      const p = existingProcess.copyWithAppendData(appendData);
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

  async append(appendTokenValue: string): Promise<Result<ConnectAppendFinishRsp, CorbadoError>> {
    const existingProcess = ConnectProcess.loadFromStorage(this.#projectId);
    if (!existingProcess) {
      return Err(CorbadoError.missingInit());
    }

    const resStart = await this.wrapWithErr(() =>
      this.#connectApi.connectAppendStart({ appendTokenValue: appendTokenValue }),
    );
    if (resStart.err) {
      return resStart;
    }

    const platformRes = await this.#webAuthnService.createPasskey(resStart.val.attestationOptions);
    if (platformRes.err) {
      return platformRes;
    }

    const finishRes = await this.wrapWithErr(() =>
      this.#connectApi.connectAppendFinish({ attestationResponse: platformRes.val }),
    );
    if (finishRes.ok) {
      // we no longer need process state after the append process has finished
      this.clearProcess();
    }

    return finishRes;
  }

  async startAppend(
    appendTokenValue: string,
    abortController?: AbortController,
  ): Promise<Result<ConnectAppendStartRsp, CorbadoError>> {
    const existingProcess = ConnectProcess.loadFromStorage(this.#projectId);
    if (!existingProcess) {
      return Err(CorbadoError.missingInit());
    }

    return this.wrapWithErr(() =>
      this.#connectApi.connectAppendStart(
        { appendTokenValue: appendTokenValue },
        abortController && { signal: abortController.signal },
      ),
    );
  }

  async completeAppend(attestationOptions: string): Promise<Result<ConnectAppendFinishRsp, CorbadoError>> {
    const existingProcess = ConnectProcess.loadFromStorage(this.#projectId);
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

      // we no longer need process state after the append process has finished
      // this.clearProcess();
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
    const existingProcess = ConnectProcess.loadFromStorage(this.#projectId);
    if (!existingProcess) {
      throw CorbadoError.missingInit();
    }

    const res = await this.wrapWithErr(() =>
      this.#connectApi.connectLoginFinish({ assertionResponse, isConditionalUI }),
    );
    if (res.ok) {
      const latestLogin = new ConnectLastLogin(res.val.passkeyOperation);
      latestLogin.persistToStorage(this.#projectId);

      // we no longer need process state after login
      this.clearProcess();
    }

    return res;
  }

  async manageInit(abortController: AbortController): Promise<Result<ConnectManageInitData, CorbadoError>> {
    const existingProcess = ConnectProcess.loadFromStorage(this.#projectId);
    if (existingProcess?.isValid()) {
      log.debug('process exists, preparing api clients');
      this.#setApisV2(existingProcess);
    }

    // process has already been initialized
    if (existingProcess?.manageData) {
      return Ok(existingProcess.manageData);
    }

    const bluetoothAvailable = await WebAuthnService.canUseBluetooth();
    const canUsePasskeys = await WebAuthnService.doesBrowserSupportPasskeys();
    const javaScriptHighEntropy = await WebAuthnService.getHighEntropyValues();
    const canUseConditionUI = await WebAuthnService.doesBrowserSupportConditionalUI();
    const maybeClientHandle = WebAuthnService.getClientHandle();
    const flags = ConnectFlags.loadFromStorage(this.#projectId);

    const req: ConnectManageInitReq = {
      clientInformation: {
        bluetoothAvailable: bluetoothAvailable,
        isUserVerifyingPlatformAuthenticatorAvailable: canUsePasskeys,
        isConditionalMediationAvailable: canUseConditionUI,
        clientEnvHandle: maybeClientHandle ?? undefined,
        javaScriptHighEntropy: javaScriptHighEntropy,
      },
      flags: flags.getItemsObject(),
    };

    log.debug('client data', req);

    const res = await this.wrapWithErr(() =>
      this.#connectApi.connectManageInit(req, { signal: abortController.signal }),
    );

    if (res.err) {
      return res;
    }

    flags.addItemsObject(res.val.flags);

    const manageData: ConnectManageInitData = {
      manageAllowed: res.val.manageAllowed,
      flags: flags.getItemsObject(),
    };

    // update local state with process
    if (existingProcess) {
      const p = existingProcess.copyWithManageData(manageData);
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
    const existingProcess = ConnectProcess.loadFromStorage(this.#projectId);

    if (!existingProcess) {
      return Err(CorbadoError.missingInit());
    }

    const req: ConnectManageListReq = {
      connectToken: passkeyListToken,
    };

    log.debug(req);

    return await this.wrapWithErr(() => this.#connectApi.connectManageList(req));
  }

  async manageDelete(
    passkeyDeleteToken: string,
    credentialID: string,
  ): Promise<Result<ConnectManageDeleteRsp, CorbadoError>> {
    const existingProcess = ConnectProcess.loadFromStorage(this.#projectId);

    if (!existingProcess) {
      return Err(CorbadoError.missingInit());
    }

    const req: ConnectManageDeleteReq = {
      connectToken: passkeyDeleteToken,
      credentialID,
    };

    log.debug(req);

    return await this.wrapWithErr(() => this.#connectApi.connectManageDelete(req));
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
}
