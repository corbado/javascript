import type { SessionUser, UserAuthMethods } from '@corbado/types';
import { AuthState } from '@corbado/types';
import log from 'loglevel';
import { Subject } from 'rxjs';
import type { Result } from 'ts-results';
import { Ok } from 'ts-results';

import type { AuthenticationResponse } from '../models/auth';
import { LoginHandler } from '../models/loginHandler';
import type { ShortSession } from '../models/session';
import type {
  AppendPasskeyError,
  CompleteLoginWithEmailOTPError,
  CompleteSignupWithEmailOTPError,
  InitAutocompletedLoginWithPasskeyError,
  InitLoginWithEmailOTPError,
  InitSignUpWithEmailOTPError,
  LoginWithPasskeyError,
  SignUpWithPasskeyError,
} from '../utils';
import type { ApiService } from './ApiService';
import type { SessionService } from './SessionService';
import type { WebAuthnService } from './WebAuthnService';

/**
 * AuthService is a class that handles authentication related operations.
 * It manages the user's authentication state and provides methods for signing up, logging in, and managing authentication methods.
 *
 * This service is the primary entrypoint for higher level SDKs (e.g. react-sdk)
 */
export class AuthService {
  #apiService: ApiService;
  #authenticatorService: WebAuthnService;

  // sessionService is used to store and manage (e.g. refresh) the user's session
  #sessionService: SessionService;

  // state for an ongoing email OTP flow (signup or login)
  // TODO: remove this?
  #emailCodeIdRef = '';

  #userChanges: Subject<SessionUser | undefined> = new Subject();
  #shortSessionChanges: Subject<string | undefined> = new Subject();
  #authStateChanges: Subject<AuthState> = new Subject();

  /**
   * The constructor initializes the AuthService with an instance of ApiService.
   */
  constructor(apiService: ApiService, sessionService: SessionService, authenticatorService: WebAuthnService) {
    this.#apiService = apiService;
    this.#authenticatorService = authenticatorService;
    this.#sessionService = sessionService;
  }

  init(isDebug = false) {
    if (isDebug) {
      log.setLevel('debug');
    } else {
      log.setLevel('error');
    }

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
  async initSignUpWithEmailOTP(email: string, username: string): Promise<Result<void, InitSignUpWithEmailOTPError>> {
    const resp = await this.#apiService.emailCodeRegisterStart(email, username);
    if (resp.err) {
      return resp;
    }

    this.#emailCodeIdRef = resp.val;

    return Ok(void 0);
  }

  /**
   * Completes an ongoing email OTP login flow.
   * Afterward, the user is logged in.
   *
   * @param otp 6-digit OTP code that was sent to the user's email
   */
  async completeLoginWithEmailOTP(otp: string): Promise<Result<void, CompleteLoginWithEmailOTPError>> {
    const resp = await this.#apiService.emailCodeConfirm(this.#emailCodeIdRef, otp);
    if (resp.err) {
      return resp;
    }

    this.#executeOnAuthenticationSuccessCallbacks(resp.val);

    return Ok(void 0);
  }

  /**
   * Completes an ongoing email OTP signUp flow.
   * Afterward, the user is logged in.
   *
   * @param otp 6-digit OTP code that was sent to the user's email
   */
  async completeSignupWithEmailOTP(otp: string): Promise<Result<void, CompleteSignupWithEmailOTPError>> {
    const resp = await this.#apiService.emailCodeConfirm(this.#emailCodeIdRef, otp);
    if (resp.err) {
      return resp;
    }

    this.#executeOnAuthenticationSuccessCallbacks(resp.val);

    return Ok(void 0);
  }

  /**
   * Creates a new user with a passkey.
   *
   * @param email
   * @param username
   */
  async signUpWithPasskey(email: string, username: string): Promise<Result<void, SignUpWithPasskeyError>> {
    const respStart = await this.#apiService.passKeyRegisterStart(email, username);
    if (respStart.err) {
      return respStart;
    }

    const signedChallenge = await this.#authenticatorService.createPasskey(respStart.val);
    if (signedChallenge.err) {
      return signedChallenge;
    }

    const respFinish = await this.#apiService.passKeyRegisterFinish(signedChallenge.val);
    if (respFinish.err) {
      return respFinish;
    }

    this.#executeOnAuthenticationSuccessCallbacks(respFinish.val);

    return Ok(void 0);
  }

  /**
   * Method to append a passkey.
   * User needs to be logged in to use this method.
   */
  async appendPasskey(): Promise<Result<void, AppendPasskeyError>> {
    const respStart = await this.#apiService.passKeyAppendStart();
    if (respStart.err) {
      return respStart;
    }

    const signedChallenge = await this.#authenticatorService.createPasskey(respStart.val);
    if (signedChallenge.err) {
      return signedChallenge;
    }

    const respFinish = await this.#apiService.passKeyAppendFinish(signedChallenge.val);
    if (respFinish.err) {
      return respFinish;
    }

    return Ok(void 0);
  }

  /**
   * Method to log in with a passkey.
   */
  async loginWithPasskey(email: string): Promise<Result<void, LoginWithPasskeyError>> {
    const respStart = await this.#apiService.passKeyLoginStart(email);
    if (respStart.err) {
      return respStart;
    }

    const signedChallenge = await this.#authenticatorService.login(respStart.val);
    if (signedChallenge.err) {
      return signedChallenge;
    }

    const respFinish = await this.#apiService.passKeyLoginFinish(signedChallenge.val);
    if (respFinish.err) {
      return respFinish;
    }

    this.#executeOnAuthenticationSuccessCallbacks(respFinish.val);

    return Ok(void 0);
  }

  /**
   * Starts a passkey flow that shows all passkeys that are available to a user (autocompletion, aka conditionalUI).
   *
   * @returns A LoginHandler that needs to be called to show these passkeys to the user.
   */
  async initAutocompletedLoginWithPasskey(): Promise<Result<LoginHandler, InitAutocompletedLoginWithPasskeyError>> {
    const respStart = await this.#apiService.passKeyMediationStart();
    if (respStart.err) {
      return respStart;
    }

    const loginHandler = new LoginHandler(async () => {
      const signedChallenge = await this.#authenticatorService.login(respStart.val);
      if (signedChallenge.err) {
        return signedChallenge;
      }

      const respFinish = await this.#apiService.passKeyLoginFinish(signedChallenge.val);
      if (respFinish.err) {
        return respFinish;
      }

      this.#executeOnAuthenticationSuccessCallbacks(respFinish.val);

      return Ok(void 0);
    });

    return Ok(loginHandler);
  }

  /**
   * Method to log in with an email OTP.
   */
  async initLoginWithEmailOTP(email: string): Promise<Result<void, InitLoginWithEmailOTPError>> {
    const resp = await this.#apiService.emailCodeLoginStart(email);
    if (resp.err) {
      return resp;
    }

    this.#emailCodeIdRef = resp.val;

    return Ok(void 0);
  }

  async authMethods(email: string) {
    const resp = await this.#apiService.usersApi.authMethodsList({
      username: email,
    });

    const result: UserAuthMethods = resp.data.data;

    return result;
  }

  logout() {
    return this.#sessionService.logout();
  }

  /**
   * Method to execute all the callbacks registered for authentication success.
   */
  #executeOnAuthenticationSuccessCallbacks = (value: AuthenticationResponse) => {
    this.#sessionService.setSession(value.shortSession, value.longSession);
  };
}
