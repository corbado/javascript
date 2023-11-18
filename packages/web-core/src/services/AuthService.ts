import {create, get} from "@github/webauthn-json";
import {Subject} from 'rxjs';

import type {AuthMethod, ShortSession} from "../api";
import type {ISessionResponse, IUser} from "../types";
import {AuthState} from "../types";
import type {ApiService} from "./ApiService";
import {SessionService} from "./SessionService";

/**
 * AuthService is a class that handles authentication-related operations.
 * It manages the user's authentication state and provides methods for signing up, logging in, and managing authentication methods.
 */
export class AuthService {
  #apiService: ApiService;
  #sessionService: SessionService;

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

  #userChanges: Subject<IUser|undefined> = new Subject();
  #shortSessionChanges: Subject<string|undefined> = new Subject();
  #authStateChanges: Subject<AuthState> = new Subject();

  /**
   * The constructor initializes the AuthService with an instance of ApiService.
   */
  constructor(apiService: ApiService, sessionService: SessionService) {
    this.#apiService = apiService
    this.#sessionService = sessionService
  }

  get userChanges() {
    return this.#userChanges.asObservable();
  }

  get shortSessionChanges() {
    return this.#shortSessionChanges.asObservable();
  }

  get authStateChanges() {
    return this.#authStateChanges.asObservable();
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
   * Method to start registration of a user by sending an email with an OTP.
   */
  async initSignUpWithEmailOTP(email: string, username: string) {
    const resp = await this.#apiService.usersApi.emailCodeRegisterStart({
      email: email,
      username: username,
    });

    this.#emailCodeIdRef = resp.data.data.emailCodeID;
  }

  /**
   * Method to verify the OTP.
   * It also sets the session token in the ApiService instance.
   * This can be used to verify both registration and login OTPs.
   * @param otp The OTP to be verified
   */
  async completeLoginWithEmailOTP(otp: string) {
    if (this.#emailCodeIdRef === "") {
      throw new Error("Email code id is empty");
    }

    const verifyResp = await this.#apiService.usersApi.emailCodeConfirm({
      code: otp,
      emailCodeID: this.#emailCodeIdRef,
    });

    this.#executeOnAuthenticationSuccessCallbacks(verifyResp.data.data);

    this.#isEmailVerified = true;
  }

  /**
   * Creates a new user and adds a passkey for him.
   */
  async signUpWithPasskey(email: string, username: string) {
    const respStart = await this.#apiService.usersApi.passKeyRegisterStart({
      username: email,
      fullName: username,
    });
    const challenge = JSON.parse(respStart.data.data.challenge);
    const signedChallenge = await create(challenge);
    const respFinish = await this.#apiService.usersApi.passKeyRegisterFinish({
      signedChallenge: JSON.stringify(signedChallenge),
    });

    this.#executeOnAuthenticationSuccessCallbacks(respFinish.data.data);

    this.#isPasskeySet = true;
  }

  /**
   * Method to append a passkey.
   * User needs to be logged in to use this method.
   */
  async appendPasskey() {
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
  async loginWithPasskey(email: string) {
    const respStart = await this.#apiService.usersApi.passKeyLoginStart({
      username: email,
    });

    const challenge = JSON.parse(respStart.data.data.challenge);
    const signedChallenge = await get(challenge);

    const respFinish = await this.#apiService.usersApi.passKeyLoginFinish({
      signedChallenge: JSON.stringify(signedChallenge),
    });

    this.#executeOnAuthenticationSuccessCallbacks(respFinish.data.data);
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

    this.#executeOnAuthenticationSuccessCallbacks(
      respFinish.data.data,
      respFinish.data.data.username
    );

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
  async initLoginWithEmailOTP(email: string) {
    const resp = await this.#apiService.usersApi.emailCodeLoginStart({
      username: email,
    });

    this.#emailCodeIdRef = resp.data.data.emailCodeID;
  }

  async logout() {
    // TODO: should we call backend to destroy the session here?

    this.#sessionService.clear();
    this.#shortSessionChanges.next(undefined);
    this.#authStateChanges.next(AuthState.LoggedOut);
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

  /**
   * Method to execute all the callbacks registered for authentication success.
   */
  #executeOnAuthenticationSuccessCallbacks = (
      sessionResponse: {
        shortSession?: ShortSession;
        longSession?: string;
        redirectURL: string;
      },
      username = ""
  ) => {
    const session: ISessionResponse = {
      shortSession: sessionResponse.shortSession,
      longSession: sessionResponse.longSession ?? "",
      redirectUrl: sessionResponse.redirectURL,
      user: username || (this.#email ?? this.#username ?? ""),
    };

    this.#sessionService.setSession(session);
    const user = this.#sessionService.getUser();

    if (user && sessionResponse.shortSession) {
      this.#shortSessionChanges.next(sessionResponse.shortSession.value);
      this.#authStateChanges.next(AuthState.LoggedIn);
      this.#userChanges.next(user);
    }
  };
}
