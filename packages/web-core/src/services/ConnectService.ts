import type { AxiosHeaders, AxiosInstance, HeadersDefaults, RawAxiosRequestHeaders } from 'axios';
import axios, { type AxiosError, type AxiosResponse } from 'axios';
import log from 'loglevel';
import type { Result } from 'ts-results';
import { Err, Ok } from 'ts-results';

import { Configuration } from '../api/v1';
import type {
  ConnectAppendFinishRsp,
  ConnectAppendInitReq,
  ConnectLoginFinishRsp,
  ConnectLoginInitReq,
} from '../api/v2';
import { ConnectApi } from '../api/v2';
import { AuthProcess } from '../models/authProcess';
import { ConnectFlags } from '../models/connect/connectFlags';
import { ConnectProcess } from '../models/connect/connectProcess';
import type { ConnectAppendInitData, ConnectLoginInitData } from '../models/connect/login';
import { CorbadoError } from '../utils';
import { WebAuthnService } from './WebAuthnService';

const packageVersion = process.env.FE_LIBRARY_VERSION;

export class ConnectService {
  #connectApi: ConnectApi = new ConnectApi();
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
    return AuthProcess.clearStorage();
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

    this.#connectApi = new ConnectApi(config, frontendApiUrl, axiosInstance);
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
    const existingProcess = ConnectProcess.loadFromStorage();
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
    const maybeClientHandle = WebAuthnService.getClientHandle();
    const flags = ConnectFlags.loadFromStorage();

    const req: ConnectLoginInitReq = {
      clientInformation: {
        bluetoothAvailable: bluetoothAvailable,
        canUsePasskeys: canUsePasskeys,
        clientEnvHandle: maybeClientHandle ?? undefined,
        javaScriptHighEntropy: javaScriptHighEntropy,
      },
      flags: flags.getItemsObject(),
    };

    const res = await this.wrapWithErr(() =>
      this.#connectApi.connectLoginInit(req, { signal: abortController.signal }),
    );
    if (res.err) {
      return res;
    }

    const loginData: ConnectLoginInitData = {
      loginAllowed: res.val.loginAllowed,
      conditionalUIChallenge: res.val.conditionalUIChallenge ?? null,
    };

    // update local state
    if (existingProcess) {
      const p = existingProcess.copyWithLoginData(loginData);
      p.persistToStorage();
    } else {
      const newProcess = new ConnectProcess(res.val.token, res.val.expiresAt, res.val.frontendApiUrl, loginData, null);
      this.#setApisV2(newProcess);
      newProcess.persistToStorage();
    }

    // persist flags
    flags.addItemsObject(res.val.flags);
    flags.persistToStorage();

    return Ok(loginData);
  }

  async login(identifier: string): Promise<Result<ConnectLoginFinishRsp, CorbadoError>> {
    const existingProcess = ConnectProcess.loadFromStorage();
    if (!existingProcess) {
      return Err(CorbadoError.missingInit());
    }

    const resStart = await this.wrapWithErr(() => this.#connectApi.connectLoginStart({ identifier }));
    if (resStart.err) {
      return resStart;
    }

    const res = await this.#webAuthnService.login(resStart.val.challenge, false, false);
    if (res.err) {
      return res;
    }

    return this.#loginFinish(res.val, false);
  }

  async conditionalUILogin(): Promise<Result<ConnectLoginFinishRsp, CorbadoError>> {
    const existingProcess = ConnectProcess.loadFromStorage();
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
    const existingProcess = ConnectProcess.loadFromStorage();
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
    const maybeClientHandle = WebAuthnService.getClientHandle();
    const flags = ConnectFlags.loadFromStorage();

    const req: ConnectAppendInitReq = {
      clientInformation: {
        bluetoothAvailable: bluetoothAvailable,
        canUsePasskeys: canUsePasskeys,
        clientEnvHandle: maybeClientHandle ?? undefined,
        javaScriptHighEntropy: javaScriptHighEntropy,
      },
      flags: flags.getItemsObject(),
    };

    const res = await this.wrapWithErr(() =>
      this.#connectApi.connectAppendInit(req, { signal: abortController.signal }),
    );
    if (res.err) {
      return res;
    }

    const appendData: ConnectAppendInitData = {
      appendAllowed: res.val.appendAllowed,
    };

    // update local state with process
    if (existingProcess) {
      const p = existingProcess.copyWithAppendData(appendData);
      p.persistToStorage();
    } else {
      const newProcess = new ConnectProcess(
        res.val.processID,
        res.val.expiresAt,
        res.val.frontendApiUrl,
        null,
        appendData,
      );
      this.#setApisV2(newProcess);
      newProcess.persistToStorage();
    }

    // persist flags
    flags.addItemsObject(res.val.flags);
    flags.persistToStorage();

    return Ok(appendData);
  }

  async append(appendTokenValue: string): Promise<Result<ConnectAppendFinishRsp, CorbadoError>> {
    const existingProcess = ConnectProcess.loadFromStorage();
    if (!existingProcess) {
      return Err(CorbadoError.missingInit());
    }

    const resStart = await this.wrapWithErr(() =>
      this.#connectApi.connectAppendStart({ appendTokenValue: appendTokenValue }),
    );
    if (resStart.err) {
      return resStart;
    }

    const platformRes = await this.#webAuthnService.createPasskey(resStart.val.challenge);
    if (platformRes.err) {
      return platformRes;
    }

    return this.wrapWithErr(() => this.#connectApi.connectAppendFinish({ signedChallenge: platformRes.val }));
  }

  dispose() {
    this.#webAuthnService.abortOngoingOperation();
  }

  async #loginFinish(
    signedChallenge: string,
    isConditionalUI: boolean,
  ): Promise<Result<ConnectLoginFinishRsp, CorbadoError>> {
    const existingProcess = ConnectProcess.loadFromStorage();
    if (!existingProcess) {
      throw CorbadoError.missingInit();
    }

    return this.wrapWithErr(() => this.#connectApi.connectLoginFinish({ signedChallenge, isConditionalUI }));
  }

  #getDefaultFrontendApiUrl() {
    return `https://${this.#projectId}.${this.#frontendApiUrlSuffix}`;
  }
}
