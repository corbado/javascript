import { create, get } from "@github/webauthn-json";

import type { AuthMethod, ShortSession } from "../api";
import type { ISessionResponse } from "../types";
import type { ApiService } from "./ApiService";

/**
 * AuthService is a class that handles authentication-related operations.
 * It manages the user's authentication state and provides methods for signing up, logging in, and managing authentication methods.
 */
export class AuthService {
  #apiService: ApiService;
  #isAuthenticated = false;
  #isEmailVerified = false;
  #isPasskeySet = false;
  #emailCodeIdRef = "";
  #email = "";
  #username = "";
  #mediationController: AbortController | null = null;
  #authMethod: Array<AuthMethod> = [];
  #possibleAuthMethods: Array<AuthMethod> = [];
  #onMediationSuccessCallbacks: Array<() => void> = [];
  #onMediationFailureCallbacks: Array<() => void> = [];
  #onAuthenticationSuccessCallbacks: Array<
    (sessionResponse: ISessionResponse) => void
  > = [];

  /**
   * The constructor initializes the AuthService with an instance of ApiService.
   */
  constructor(apiService: ApiService) {
    this.#apiService = apiService;
  }

  get isAuthenticated() {
    return this.#isAuthenticated;
  }

  get isEmailVerified() {
    return this.#isEmailVerified;
  }

  get isPasskeySet() {
    return this.#isPasskeySet;
  }

  get email() {
    return this.#email;
  }

  get username() {
    return this.#username;
  }

  get authMethod() {
    return this.#authMethod;
  }

  get possibleAuthMethods() {
    return this.#possibleAuthMethods;
  }

  /**
   * Method to add a callback function to be called when mediation is successful.
   */
  onMediationSuccess(callback: () => void) {
    this.#onMediationSuccessCallbacks.push(callback);
  }

  /**
   * Method to add a callback function to be called when mediation fails.
   */
  onMediationFailure(callback: () => void) {
    this.#onMediationFailureCallbacks.push(callback);
  }

  /**
   * Method to add a callback function to be called when authentication is successful.
   */
  onAuthenticationSuccess(
    callback: (sessionResponse: ISessionResponse) => void
  ) {
    this.#onAuthenticationSuccessCallbacks.push(callback);
  }

  /**
   * Method to execute all the callbacks registered for authentication success.
   */
  #executeOnAuthenticationSuccessCallbacks = (sessionResponse: {
    shortSession?: ShortSession;
    longSession?: string;
    redirectURL: string;
  }) => {
    const session: ISessionResponse = {
      shortSession: sessionResponse.shortSession,
      longSession: sessionResponse.longSession ?? "",
      redirectUrl: sessionResponse.redirectURL,
      user: this.#email ?? this.#username ?? "",
    };

    this.#isAuthenticated = true;

    this.#onAuthenticationSuccessCallbacks.forEach((cb) => cb(session));
  };

  /**
   * Method to initiate the signup process.
   */
  initiateSignup(email: string, username = "") {
    this.#email = email;
    this.#username = username;
  }

  /**
   * Method to initiate the login process.
   * This method fetches the authentication methods for the user as well based on the given email/username.
   */
  async initiateLogin(email: string) {
    this.#email = email;

    const resp = await this.#apiService.usersApi.authMethodsList({
      username: this.#email,
    });

    this.#authMethod = resp.data.data.selectedMethods;
    this.#possibleAuthMethods = resp.data.data.possibleMethods;
  }

  /**
   * Method to start registration of a user by sending an email with an OTP.
   */
  async sendEmailWithOTP() {
    const resp = await this.#apiService.usersApi.emailCodeRegisterStart({
      email: this.#email,
      username: this.#username,
    });

    this.#emailCodeIdRef = resp.data.data.emailCodeID;

    return resp.status === 200;
  }

  /**
   * Method to verify the OTP.
   * It also sets the session token in the ApiService instance.
   * This can be used to verify both registration and login OTPs.
   * @param otp The OTP to be verified
   */
  async verifyOTP(otp: string) {
    if (this.#emailCodeIdRef === "") {
      throw new Error("Email code id is empty");
    }

    const verifyResp = await this.#apiService.usersApi.emailCodeConfirm({
      code: otp,
      emailCodeID: this.#emailCodeIdRef,
    });

    this.#executeOnAuthenticationSuccessCallbacks(verifyResp.data.data);

    this.#isEmailVerified = true;

    return verifyResp.status === 200;
  }

  /**
   * Method to register a passkey.
   * This is used in passkey creation flow.
   */
  async passkeyRegister() {
    const respStart = await this.#apiService.usersApi.passKeyRegisterStart({
      username: this.#email,
      fullName: this.#username,
    });
    const challenge = JSON.parse(respStart.data.data.challenge);
    const signedChallenge = await create(challenge);
    const respFinish = await this.#apiService.usersApi.passKeyRegisterFinish({
      signedChallenge: JSON.stringify(signedChallenge),
    });

    this.#executeOnAuthenticationSuccessCallbacks(respFinish.data.data);

    this.#isPasskeySet = true;

    return respFinish.status === 200;
  }

  /**
   * Method to append a passkey.
   * User needs to be logged in to use this method.
   */
  async passkeyAppend() {
    const respStart = await this.#apiService.usersApi.passKeyAppendStart({});
    const challenge = JSON.parse(respStart.data.data.challenge);
    const signedChallenge = await create(challenge);
    const respFinish = await this.#apiService.usersApi.passKeyAppendFinish({
      signedChallenge: JSON.stringify(signedChallenge),
    });

    this.#isPasskeySet = true;

    return respFinish.status === 200;
  }

  /**
   * Method to login with a passkey.
   */
  async passkeyLogin() {
    const respStart = await this.#apiService.usersApi.passKeyLoginStart({
      username: this.#email,
    });
    const challenge = JSON.parse(respStart.data.data.challenge);
    const signedChallenge = await get(challenge);
    const respFinish = await this.#apiService.usersApi.passKeyLoginFinish({
      signedChallenge: JSON.stringify(signedChallenge),
    });

    this.#executeOnAuthenticationSuccessCallbacks(respFinish.data.data);

    return respFinish.status === 200;
  }

  /**
   * Method to mediate a passkey.
   * This is used in passkey mediation / conditional UI flow.
   */
  async passkeyMediation(username?: string) {
    const controller = new AbortController();
    const signal = controller.signal;
    this.#mediationController = controller;

    const respStart = await this.#apiService.usersApi.passKeyMediationStart(
      username ? { username } : {}
    );
    const challenge = JSON.parse(respStart.data.data.challenge);
    challenge.mediation = "conditional";
    challenge.signal = signal;

    const signedChallenge = await get(challenge);
    const respFinish = await this.#apiService.usersApi.passKeyLoginFinish({
      signedChallenge: JSON.stringify(signedChallenge),
    });

    this.#executeOnAuthenticationSuccessCallbacks(respFinish.data.data);

    const successful = respFinish.status === 200;

    if (successful) {
      this.#onMediationSuccessCallbacks.forEach((cb) => cb());
    } else {
      this.#onMediationFailureCallbacks.forEach((cb) => cb());
    }

    return successful;
  }

  /**
   * Method to login with an email OTP.
   */
  async emailOtpLogin() {
    const resp = await this.#apiService.usersApi.emailCodeLoginStart({
      username: this.#email,
    });

    this.#emailCodeIdRef = resp.data.data.emailCodeID;

    return resp.status === 200;
  }

  /**
   * Method to destroy the AuthService.
   */
  destroy() {
    if (!this.#mediationController) {
      return;
    }

    try {
      this.#mediationController.abort("User chose to cancel");
    } catch (e) {
      console.error(e);
    }
  }
}
