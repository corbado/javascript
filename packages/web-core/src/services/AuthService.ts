import {create, get} from "@github/webauthn-json";
import {Subject} from 'rxjs';

import type {ShortSession as ApiShortSession} from "../api";
import {AuthState, IUser, LoginHandler, ShortSession} from "../types";
import type {ApiService} from "./ApiService";
import {SessionService} from "./SessionService";

/**
 * AuthService is a class that handles authentication related operations.
 * It manages the user's authentication state and provides methods for signing up, logging in, and managing authentication methods.
 *
 * This service is the primary entrypoint for higher level SDKs (e.g. react-sdk)
 */
export class AuthService {
  #apiService: ApiService;

  // sessionService is used to store and manage (e.g. refresh) the user's session
  #sessionService: SessionService;

  // state for an ongoing email OTP flow (signup or login)
  // TODO: remove this?
  #emailCodeIdRef = "";

  #userChanges: Subject<IUser | undefined> = new Subject();
  #shortSessionChanges: Subject<string | undefined> = new Subject();
  #authStateChanges: Subject<AuthState> = new Subject();

  /**
   * The constructor initializes the AuthService with an instance of ApiService.
   */
  constructor(apiService: ApiService, sessionService: SessionService) {
    this.#apiService = apiService
    this.#sessionService = sessionService
  }

  init() {
    this.#sessionService.init((shortSession: ShortSession | undefined) => {
      const user = this.#sessionService.getUser();

      if (user && shortSession) {
        this.#shortSessionChanges.next(shortSession.value);
        this.#authStateChanges.next(AuthState.LoggedIn);
        this.#userChanges.next(user);
      } else {
        this.#shortSessionChanges.next(undefined);
        this.#authStateChanges.next(AuthState.LoggedOut);
        this.#userChanges.next(undefined);
      }
    });
  }

  /**
   * Exposes changes to the user object
   */
  get userChanges() {
    return this.#userChanges.asObservable();
  }

  /**
   * Exposes changes to the shortSession
   */
  get shortSessionChanges() {
    return this.#shortSessionChanges.asObservable();
  }

  /**
   * Exposes changes to the auth state
   */
  get authStateChanges() {
    return this.#authStateChanges.asObservable();
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
   * Completes an ongoing email OTP login flow.
   * Afterward, the user is logged in.
   *
   * @param otp 6-digit OTP code that was sent to the user's email
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
  }

  /**
   * Completes an ongoing email OTP signUp flow.
   * Afterward, the user is logged in.
   *
   * @param otp 6-digit OTP code that was sent to the user's email
   */
  async completeSignupWithEmailOTP(otp: string) {
    if (this.#emailCodeIdRef === "") {
      throw new Error("Email code id is empty");
    }

    const verifyResp = await this.#apiService.usersApi.emailCodeConfirm({
      code: otp,
      emailCodeID: this.#emailCodeIdRef,
    });

    this.#executeOnAuthenticationSuccessCallbacks(verifyResp.data.data);
  }

  /**
   * Creates a new user with a passkey.
   *
   * @param email
   * @param username
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

    if (respFinish.status !== 200) {
      console.log('error during append passkey', respFinish)
    }
  }

  /**
   * Method to log in with a passkey.
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

    console.log('after login', respFinish.data.data)
    this.#executeOnAuthenticationSuccessCallbacks(respFinish.data.data);
  }

  /**
   * Starts a passkey flow that shows all passkeys that are available to a user (autocompletion, aka conditionalUI).
   *
   * @returns A LoginHandler that needs to be called to show these passkeys to the user.
   */
  async initAutocompletedLoginWithPasskey(): Promise<LoginHandler> {
    const respStart = await this.#apiService.usersApi.passKeyMediationStart({
      username: ''
    })

    return new LoginHandler(async () => {
      console.log('LoginHandler called')
      const challenge = JSON.parse(respStart.data.data.challenge);
      const signedChallenge = await get(challenge);
      const respFinish = await this.#apiService.usersApi.passKeyLoginFinish({
        signedChallenge: JSON.stringify(signedChallenge),
      });

      this.#executeOnAuthenticationSuccessCallbacks(respFinish.data.data)
    })
  }

  /**
   * Method to log in with an email OTP.
   */
  async initLoginWithEmailOTP(email: string) {
    const resp = await this.#apiService.usersApi.emailCodeLoginStart({
      username: email,
    });

    this.#emailCodeIdRef = resp.data.data.emailCodeID;
  }

  async logout() {
    return this.#sessionService.logout();
  }

  /**
   * Method to execute all the callbacks registered for authentication success.
   */
  #executeOnAuthenticationSuccessCallbacks = (
    sessionResponse: {
      shortSession?: ApiShortSession;
      longSession?: string;
      redirectURL: string;
    }
  ) => {
    if (!sessionResponse.shortSession?.value) {
      return
    }

    const shortSession = new ShortSession(sessionResponse.shortSession?.value)
    this.#sessionService.setSession(shortSession, sessionResponse.longSession);
  };
}
