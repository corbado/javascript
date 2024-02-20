import type { SessionUser } from '@corbado/types';
import log from 'loglevel';
import { BehaviorSubject } from 'rxjs';
import type { Result } from 'ts-results';
import { Ok } from 'ts-results';

import type { ShortSession } from '../models/session';
import type { AppendPasskeyError, GetProjectConfigError, GlobalError, RecoverableError } from '../utils';
import { AuthState } from '../utils';
import type { ApiService } from './ApiService';
import { SessionService } from './SessionService';
import { WebAuthnService } from './WebAuthnService';

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

  #userChanges: BehaviorSubject<SessionUser | undefined> = new BehaviorSubject<SessionUser | undefined>(undefined);
  #shortSessionChanges: BehaviorSubject<string | undefined> = new BehaviorSubject<string | undefined>(undefined);
  #authStateChanges: BehaviorSubject<AuthState> = new BehaviorSubject<AuthState>(AuthState.LoggedOut);

  /**
   * The constructor initializes the AuthService with an instance of ApiService.
   */
  constructor(apiService: ApiService, globalErrors: GlobalError, setShortSessionCookie: boolean) {
    this.#apiService = apiService;
    this.#webAuthnService = new WebAuthnService(globalErrors);
    this.#sessionService = new SessionService(apiService, setShortSessionCookie);
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

  async init(isDebug = false): Promise<Result<void, GetProjectConfigError>> {
    if (isDebug) {
      log.setLevel('debug');
    } else {
      log.setLevel('error');
    }

    // const projectConfig = await this.#apiService.getProjectConfig();
    // if (projectConfig.err) {
    //   return Err(projectConfig.val);
    // }

    // TODO: The backend is not exposing this parameter, we will add it today or tomorrow => then the hard-coding will be
    const useCorbadoSessionManagement = true;
    if (useCorbadoSessionManagement) {
      await this.#setupSessionManagement();
    }

    return Ok(void 0);
  }

  abortOngoingPasskeyOperation() {
    this.#webAuthnService.abortOngoingOperation();
  }

  /**
   * Method to append a passkey.
   * User needs to be logged in to use this method.
   */
  // TODO: implement this method
  // eslint-disable-next-line @typescript-eslint/require-await
  async appendPasskey(): Promise<Result<void, AppendPasskeyError | undefined>> {
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

  userExists(email: string): Promise<Result<boolean, RecoverableError | undefined>> {
    return this.#apiService.userExists('email', email);
  }

  logout() {
    return this.#sessionService.logout();
  }

  /**
   * Method to execute all the callbacks registered for authentication success.
   */
  // #executeOnAuthenticationSuccessCallbacks = (value: AuthenticationResponse) => {
  //   this.#sessionService.setSession(value.shortSession, value.longSession);
  // };

  #setupSessionManagement = async () => {
    await this.#sessionService.init((shortSession: ShortSession | undefined) => {
      const user = this.#sessionService.getUser();

      if (user && shortSession) {
        this.#shortSessionChanges.next(shortSession.value);
        this.#updateAuthState(AuthState.LoggedIn);
        this.#updateUser(user);
      } else {
        this.#shortSessionChanges.next(undefined);
        this.#updateAuthState(AuthState.LoggedOut);
        this.#updateUser(undefined);
      }
    });
  };

  #updateUser = (user: SessionUser | undefined) => {
    const currentUser = this.#userChanges.value;

    if (currentUser === user) {
      return;
    }

    if (
      currentUser?.email === user?.email &&
      currentUser?.name === user?.name &&
      currentUser?.orig === user?.orig &&
      currentUser?.sub === user?.sub
    ) {
      return;
    }

    this.#userChanges.next(user);
  };

  #updateAuthState = (authState: AuthState) => {
    if (this.#authStateChanges.value === authState) {
      return;
    }

    this.#authStateChanges.next(authState);
  };
}
