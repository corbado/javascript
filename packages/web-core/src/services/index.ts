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
import { SessionService } from "./SessionService";

export type { FlowHandlerService } from "./FlowHandler";
export type { ProjectService } from "./ProjectService";
export type { AuthService } from "./AuthService";
export type { SessionService } from "./SessionService";

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
  #apiService: ApiService;
  #flowHandlerService: FlowHandlerService | null = null;
  #authService: AuthService;
  #projectService: ProjectService;
  #sessionService: SessionService;
  #projectId: string;
  #onInitCallbacks: Array<(app: CorbadoApp) => void> = [];

  /**
   * The constructor initializes the services and sets up the application.
   */
  constructor(corbadoParams: ICorbadoAppParams) {
    const { projectId, apiTimeout = defaultTimeout } = corbadoParams;
    this.#projectId = projectId;
    this.#apiService = new ApiService(this.#projectId, apiTimeout);
    this.#authService = new AuthService(this.#apiService);
    this.#projectService = new ProjectService(this.#apiService);
    this.#sessionService = new SessionService(this.#apiService);

    void this.init(corbadoParams);
  }

  public get apiService() {
    return this.#apiService;
  }

  public get flowHandlerService() {
    return this.#flowHandlerService;
  }

  public get authService() {
    return this.#authService;
  }

  public get projectService() {
    return this.#projectService;
  }

  public get sessionService() {
    return this.#sessionService;
  }

  /**
   * Method to add a callback function to be called when the application is initialized.
   */
  public onInit(cb: (app: CorbadoApp) => void) {
    this.#onInitCallbacks.push(cb);
  }

  /**
   * Method to initialize the application.
   * It fetches the project configuration and sets up the flow handler service.
   */
  private async init(corbadoParams: ICorbadoAppParams) {
    const projConfig = await this.#projectService.getProjectConfig();

    const flowName =
      (corbadoParams.defaultToLogin
        ? corbadoParams.loginFlowName
        : corbadoParams.signupFlowName) ??
      LoginFlowNames.PasskeyLoginWithEmailOTPFallback;

    this.#flowHandlerService = new FlowHandlerService(flowName, projConfig, {
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
      this.#flowHandlerService?.currentFlowName !==
      LoginFlowNames.PasskeyLoginWithEmailOTPFallback
    ) {
      return;
    }

    const isConditionalUISupported = await mediationAvailable();
    const alwaysTrue = true;

    if (isConditionalUISupported || alwaysTrue) {
      void this.#authService.passkeyMediation();
    }
  }

  /**
   * Method to be called after the application is initialized.
   * It calls the onInit callbacks and initiates the login process.
   * It also sets up listeners for flow and screen changes, and mediation success and failure.
   */
  private afterInit() {
    if (this.#onInitCallbacks.length) {
      this.#onInitCallbacks.forEach((cb) => cb(this));
    }

    void this.initiateLogin();

    if (this.#flowHandlerService) {
      this.#flowHandlerService.onFlowChange(() => {
        return void this.initiateLogin();
      });

      this.#flowHandlerService.onScreenChange(() => {
        if (
          this.#flowHandlerService?.currentScreenName === CommonScreens.EnterOtp
        ) {
          if (
            this.#flowHandlerService?.currentFlowName ===
            LoginFlowNames.PasskeyLoginWithEmailOTPFallback
          ) {
            void this.#authService.emailOtpLogin();
          } else {
            void this.#authService.sendEmailWithOTP();
          }
        }
      });
    }

    this.#authService.onMediationSuccess(() => {
      return void this.#flowHandlerService?.navigateToNextScreen({
        success: true,
      });
    });

    this.#authService.onMediationFailure(() => {
      return void this.#flowHandlerService?.navigateToNextScreen({
        failure: true,
      });
    });

    this.#authService.onAuthenticationSuccess((sessionResponse) => {
      this.#sessionService.setSession(sessionResponse);
      if (this.#flowHandlerService) {
        this.#flowHandlerService.redirectUrl = sessionResponse.redirectUrl;
      }
    });
  }

  /**
   * Method to destroy the application.
   * It calls the destroy method of the AuthService.
   */
  public destroy() {
    this.#authService.destroy();
  }
}
