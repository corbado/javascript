import type { IFlowHandlerConfig } from "../types";
import type { SignUpFlowNames } from "../utils";
import {
  CommonScreens,
  defaultTimeout,
  LoginFlowNames,
  mediationAvailable,
} from "../utils";
import { ApiService } from "./ApiService";
import { AuthService } from "./AuthService";
import { FlowHandlerService } from "./FlowHandler";
import { ProjectService } from "./ProjectService";

export type { FlowHandlerService } from "./FlowHandler";
export type { ProjectService } from "./ProjectService";
export type { AuthService } from "./AuthService";

export interface ICorbadoAppParams extends Partial<IFlowHandlerConfig> {
  projectId: string;
  apiTimeout?: number;
  defaultToLogin?: boolean;
  signupFlowName?: SignUpFlowNames;
  loginFlowName?: LoginFlowNames;
}

/**
 * CorbadoApp is a class that represents the main application.
 * It manages the services and the flow of the application.
 * It also handles the initialization and destruction of the application.
 */
export class CorbadoApp {
  private _apiService: ApiService;
  private _flowHandlerService: FlowHandlerService | null = null;
  private _authService: AuthService;
  private _projectService: ProjectService;
  private _projectId: string;
  private _onInitCallbacks: Array<(app: CorbadoApp) => void> = [];

  /**
   * The constructor initializes the services and sets up the application.
   */
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

  /**
   * Method to add a callback function to be called when the application is initialized.
   */
  public onInit(cb: (app: CorbadoApp) => void) {
    this._onInitCallbacks.push(cb);
  }

  /**
   * Method to initialize the application.
   * It fetches the project configuration and sets up the flow handler service.
   */
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

  /**
   * Method to initiate the login process.
   * It checks if the current flow belongs to login flow and if so, initiates the passkey mediation.
   */
  private async initiateLogin() {
    if (
      this._flowHandlerService?.currentFlowName !==
      LoginFlowNames.PasskeyLoginWithEmailOTPFallback
    ) {
      return;
    }

    const isConditionalUISupported = await mediationAvailable();

    if (isConditionalUISupported) {
      void this._authService.passkeyMediation();
    }
  }

  /**
   * Method to be called after the application is initialized.
   * It calls the onInit callbacks and initiates the login process.
   * It also sets up listeners for flow and screen changes, and mediation success and failure.
   */
  private afterInit() {
    if (this._onInitCallbacks.length) {
      this._onInitCallbacks.forEach((cb) => cb(this));
    }

    void this.initiateLogin();

    if (this._flowHandlerService) {
      this._flowHandlerService.onFlowChange(() => {
        return void this.initiateLogin();
      });

      this._flowHandlerService.onScreenChange(() => {
        if (
          this._flowHandlerService?.currentScreenName === CommonScreens.EnterOtp
        ) {
          if (
            this._flowHandlerService?.currentFlowName ===
            LoginFlowNames.PasskeyLoginWithEmailOTPFallback
          ) {
            void this._authService.emailOtpLogin();
          } else {
            void this._authService.sendEmailWithOTP();
          }
        }
      });

      this._authService.onMediationSuccess(() => {
        return void this._flowHandlerService?.navigateToNextScreen({
          success: true,
        });
      });

      this._authService.onMediationFailure(() => {
        return void this._flowHandlerService?.navigateToNextScreen({
          failure: true,
        });
      });
    }
  }

  /**
   * Method to destroy the application.
   * It calls the destroy method of the AuthService.
   */
  public destroy() {
    this._authService.destroy();
  }
}
