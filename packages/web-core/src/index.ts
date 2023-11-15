import {
  ApiService,
  AuthService,
  FlowHandlerService,
  ProjectService,
} from "./services";
import type { IFlowHandlerConfig } from "./types";
import type { SignUpFlowNames } from "./utils";
import { LoginFlowNames, mediationAvailable } from "./utils";
import { defaultTimeout } from "./utils";

export * from "./utils/constants";
export * from "./utils/helpers/webAuthUtils";
export * from "./types";
export type {
  AuthService,
  ApiService,
  FlowHandlerService,
  ProjectService,
} from "./services";

export interface ICorbadoAppParams extends Partial<IFlowHandlerConfig> {
  projectId: string;
  apiTimeout?: number;
  defaultToLogin?: boolean;
  signupFlowName?: SignUpFlowNames;
  loginFlowName?: LoginFlowNames;
}
export class CorbadoApp {
  private _apiService: ApiService;
  private _flowHandlerService: FlowHandlerService | null = null;
  private _authService: AuthService;
  private _projectService: ProjectService;
  private _projectId: string;
  private onInitCallbacks: Array<(app: CorbadoApp) => void> = [];

  constructor(corbadoParams: ICorbadoAppParams) {
    const { projectId, apiTimeout = defaultTimeout } = corbadoParams;
    this._projectId = projectId;
    this._apiService = new ApiService(this._projectId, apiTimeout);
    this._authService = new AuthService(this._apiService);
    this._projectService = new ProjectService(this._apiService);

    void this.init(corbadoParams);
  }

  public get apiService() {
    return this._apiService;
  }

  public get flowHandlerService() {
    return this._flowHandlerService;
  }

  public get authService() {
    return this._authService;
  }

  public get projectService() {
    return this._projectService;
  }

  onInit(cb: (app: CorbadoApp) => void) {
    this.onInitCallbacks.push(cb);
  }

  private async init(corbadoParams: ICorbadoAppParams) {
    const projConfig = await this._projectService.getProjectConfig();

    const flowName =
      (corbadoParams.defaultToLogin
        ? corbadoParams.loginFlowName
        : corbadoParams.signupFlowName) ??
      LoginFlowNames.PasskeyLoginWithEmailOTPFallback;

    this._flowHandlerService = new FlowHandlerService(flowName, projConfig, {
      passkeyAppend: corbadoParams.passkeyAppend ?? false,
      retryPasskeyOnError: corbadoParams.retryPasskeyOnError ?? false,
      compulsoryEmailVerification:
        corbadoParams.compulsoryEmailVerification ?? false,
      shouldRedirect: corbadoParams.shouldRedirect ?? false,
    });

    this.afterInit();
  }

  private async initiateLogin() {
    if (
      this._flowHandlerService?.currentFlowName !==
      LoginFlowNames.PasskeyLoginWithEmailOTPFallback
    ) {
      return;
    }

    const isConditionalUISupported = await mediationAvailable();
    const alwaysTrue = true;

    if (isConditionalUISupported || alwaysTrue) {
      void this._authService.passkeyMediation();
    }
  }

  private afterInit() {
    if (this.onInitCallbacks.length) {
      this.onInitCallbacks.forEach((cb) => cb(this));
    }

    void this.initiateLogin();

    if (this._flowHandlerService) {
      this._flowHandlerService.onFlowChange(() => {
        return void this.initiateLogin();
      });
    }
  }

  public destroy() {
    console.log("Destroying CorbadoApp");
    this._authService.destroy();
  }
}
