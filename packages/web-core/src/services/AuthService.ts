import type { SessionUser } from '@corbado/types';
import log from 'loglevel';
import { BehaviorSubject } from 'rxjs';
import type { Result } from 'ts-results';
import { Ok } from 'ts-results';

import type { AuthenticationResponse } from '../models/auth';
import type { ShortSession } from '../models/session';
import type {
  AppendPasskeyError,
  CompleteLoginWithEmailLinkError,
  CompleteLoginWithEmailOTPError,
  CompleteSignupWithEmailLinkError,
  CompleteSignupWithEmailOTPError,
  InitLoginWithEmailLinkError,
  InitLoginWithEmailOTPError,
  InitSignUpWithEmailLinkError,
  InitSignUpWithEmailOTPError,
  LoginWithPasskeyError,
  RecoverableError,
  SignUpWithPasskeyError,
} from '../utils';
import { AuthState } from '../utils';
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
  #webAuthnService: WebAuthnService;

  // sessionService is used to store and manage (e.g. refresh) the user's session
  #sessionService: SessionService;

  // state for an ongoing email OTP flow (signup or login)
  #emailCodeIdRef = '';

  // state for an ongoing email link flow (signup or login)
  #emailLinkIdRef = '';

  #userChanges: BehaviorSubject<SessionUser | undefined> = new BehaviorSubject<SessionUser | undefined>(undefined);
  #shortSessionChanges: BehaviorSubject<string | undefined> = new BehaviorSubject<string | undefined>(undefined);
  #authStateChanges: BehaviorSubject<AuthState> = new BehaviorSubject<AuthState>(AuthState.LoggedOut);

  /**
   * The constructor initializes the AuthService with an instance of ApiService.
   */
  constructor(apiService: ApiService, sessionService: SessionService, webAuthnService: WebAuthnService) {
    this.#apiService = apiService;
    this.#webAuthnService = webAuthnService;
    this.#sessionService = sessionService;
  }

  /**
   * Exposes changes to the user object
   */
  get userChanges(): BehaviorSubject<SessionUser | undefined> {
    return this.#userChanges;
  }

  /**
   * Exposes changes to the shortSession
   */
  get shortSessionChanges(): BehaviorSubject<string | undefined> {
    return this.#shortSessionChanges;
  }

  /**
   * Exposes changes to the auth state
   */
  get authStateChanges(): BehaviorSubject<AuthState> {
    return this.#authStateChanges;
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
   * Method to start registration of a user by sending an email with an OTP.
   */
  async initSignUpWithEmailOTP(
    email: string,
    username: string,
  ): Promise<Result<void, InitSignUpWithEmailOTPError | undefined>> {
    const resp = await this.#apiService.emailCodeRegisterStart(email, username);
    if (resp.err) {
      return resp;
    }

    this.#emailCodeIdRef = resp.val;

    return Ok(void 0);
  }

  /**
   * Completes an ongoing email OTP signUp flow.
   * Afterward, the user is logged in.
   *
   * @param otp 6-digit OTP code that was sent to the user's email
   */
  async completeSignupWithEmailOTP(otp: string): Promise<Result<void, CompleteSignupWithEmailOTPError | undefined>> {
    const resp = await this.#apiService.emailCodeConfirm(this.#emailCodeIdRef, otp);
    if (resp.err) {
      return resp;
    }

    this.#executeOnAuthenticationSuccessCallbacks(resp.val);

    return Ok(void 0);
  }

  /**
   * Method to log in with an email OTP.
   */
  async initLoginWithEmailOTP(email: string): Promise<Result<void, InitLoginWithEmailOTPError | undefined>> {
    const resp = await this.#apiService.emailCodeLoginStart(email);
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
  async completeLoginWithEmailOTP(otp: string): Promise<Result<void, CompleteLoginWithEmailOTPError | undefined>> {
    const resp = await this.#apiService.emailCodeConfirm(this.#emailCodeIdRef, otp);
    if (resp.err) {
      return resp;
    }

    this.#executeOnAuthenticationSuccessCallbacks(resp.val);

    return Ok(void 0);
  }

  /**
   * Method to start registration of a user by sending an email with a link.
   */
  async initSignUpWithEmailLink(
    email: string,
    username: string,
  ): Promise<Result<void, InitSignUpWithEmailLinkError | undefined>> {
    const resp = await this.#apiService.emailLinkRegisterStart(email, username);
    if (resp.err) {
      return resp;
    }

    this.#emailLinkIdRef = resp.val;

    return Ok(void 0);
  }

  /**
   * Completes an ongoing email link signUp flow.
   * Afterward, the user is logged in.
   *
   * @param token token that was sent to the user's email
   */
  async completeSignupWithEmailLink(
    token: string,
  ): Promise<Result<void, CompleteSignupWithEmailLinkError | undefined>> {
    const resp = await this.#apiService.emailLinkConfirm(this.#emailLinkIdRef, token);
    if (resp.err) {
      return resp;
    }

    this.#executeOnAuthenticationSuccessCallbacks(resp.val);

    return Ok(void 0);
  }

  /**
   * Method to log in with an email link.
   */
  async initLoginWithEmailLink(email: string): Promise<Result<void, InitLoginWithEmailLinkError | undefined>> {
    const resp = await this.#apiService.emailLinkLoginStart(email);
    if (resp.err) {
      return resp;
    }

    this.#emailLinkIdRef = resp.val;

    return Ok(void 0);
  }

  /**
   * Completes an ongoing email link login flow.
   * Afterward, the user is logged in.
   *
   * @param token token that was sent to the user's email
   */
  async completeLoginWithEmailLink(token: string): Promise<Result<void, CompleteLoginWithEmailLinkError | undefined>> {
    const resp = await this.#apiService.emailCodeConfirm(this.#emailLinkIdRef, token);
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
  async signUpWithPasskey(email: string, username: string): Promise<Result<void, SignUpWithPasskeyError | undefined>> {
    const respStart = await this.#apiService.passKeyRegisterStart(email, username);
    if (respStart.err) {
      return respStart;
    }

    const signedChallenge = await this.#webAuthnService.createPasskey(respStart.val);
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
   * Method to log in with a passkey.
   *
   * @param email
   */
  async loginWithPasskey(email: string): Promise<Result<void, LoginWithPasskeyError | undefined>> {
    return this.#loginWithPasskey(email, false);
  }

  async loginWithConditionalUI(): Promise<Result<void, LoginWithPasskeyError | undefined>> {
    return this.#loginWithPasskey('', true);
  }

  /**
   * Method to append a passkey.
   * User needs to be logged in to use this method.
   */
  async appendPasskey(): Promise<Result<void, AppendPasskeyError | undefined>> {
    const respStart = await this.#apiService.passKeyAppendStart();
    if (respStart.err) {
      return respStart;
    }

    const signedChallenge = await this.#webAuthnService.createPasskey(respStart.val);
    if (signedChallenge.err) {
      return signedChallenge;
    }

    const respFinish = await this.#apiService.passKeyAppendFinish(signedChallenge.val);
    if (respFinish.err) {
      return respFinish;
    }

    return Ok(void 0);
  }

  async passkeyList() {
    const resp = await this.#apiService.passkeyList();
    return resp;
  }

  async passkeyDelete(id: string) {
    const resp = await this.#apiService.passkeyDelete(id);
    return resp;
  }

  async authMethods(email: string) {
    const resp = await this.#apiService.authMethodsList(email);

    return resp;
  }

  async userExists(email: string): Promise<Result<boolean, RecoverableError | undefined>> {
    const resp = await this.#apiService.authMethodsList(email);
    if (resp.err) {
      return Ok(false);
    }

    return Ok(resp.ok);
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

  async #loginWithPasskey(
    email: string,
    conditional = false,
  ): Promise<Result<void, LoginWithPasskeyError | undefined>> {
    let resp: Result<string, LoginWithPasskeyError | undefined>;
    if (conditional) {
      resp = await this.#apiService.passKeyMediationStart();
    } else {
      resp = await this.#apiService.passKeyLoginStart(email);
    }

    if (resp.err) {
      return resp;
    }

    const signedChallenge = await this.#webAuthnService.login(resp.val, conditional);
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
}
