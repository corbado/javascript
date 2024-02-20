import type { CorbadoUser, SessionUser } from '@corbado/types';
import type { AxiosRequestConfig } from 'axios';
import log from 'loglevel';

import { ShortSession } from '../models/session';
import type { ApiService } from './ApiService';

const shortSessionKey = 'cbo_short_session';
const longSessionKey = 'cbo_long_session';

// controls how long before the shortSession expires we should refresh it
const shortSessionRefreshBeforeExpirationSeconds = 60;
// controls how often we check if we need to refresh the session
const shortSessionRefreshIntervalMs = 10_000;

/**
 * The SessionService manages user sessions for the Corbado Application, handling shortSession and longSession.
 * It offers methods to set, delete, and retrieve these tokens and the username,
 * as well as a method to fetch the full user object from the Corbado API.
 *
 * The longSession should not be exposed from this service as it is only used for session refresh.
 */
export class SessionService {
  readonly #apiService: ApiService;
  readonly #setShortSessionCookie: boolean;
  #shortSession: ShortSession | undefined;
  #longSession: string | undefined;
  #onShortSessionChange?: (value: ShortSession | undefined) => void;
  #refreshIntervalId: NodeJS.Timeout | undefined;

  constructor(apiService: ApiService, setShortSessionCookie: boolean) {
    this.#apiService = apiService;
    this.#longSession = undefined;
    this.#setShortSessionCookie = setShortSessionCookie;
  }

  /**
   * Initializes the SessionService by registering a callback that is called when the shortSession changes.
   *
   * @param onShortSessionChange
   */
  async init(onShortSessionChange: (value: ShortSession | undefined) => void) {
    this.#onShortSessionChange = onShortSessionChange;

    this.#longSession = SessionService.#getLongSessionToken();
    this.#shortSession = SessionService.#getShortTermSessionToken();

    // if the session is valid, we emit it
    if (this.#shortSession && this.#shortSession.isValidForXMoreSeconds(0)) {
      log.debug('emit shortsession', this.#shortSession);
      this.#onShortSessionChange(this.#shortSession);
    } else {
      await this.#handleRefreshRequest();
    }

    this.#apiService.setInstanceWithToken(this.#longSession);

    // init scheduled session refresh
    // TODO: make use of pageVisibility event and service workers
    this.#refreshIntervalId = setInterval(() => {
      void this.#handleRefreshRequest();
    }, shortSessionRefreshIntervalMs);

    document.addEventListener('visibilitychange', () => {
      this.#handleVisibilityChange();
    });
  }

  /**
   * Getter method for retrieving the short term session token.
   * @returns The short term session token or null if it's not set.
   */
  public get shortSession() {
    return this.#shortSession;
  }

  /**
   * Getter method for retrieving the username.
   * @returns The username or null if it's not set.
   */
  public getUser(): SessionUser | undefined {
    if (!this.#shortSession) {
      return;
    }

    const sessionParts = this.#shortSession.value.split('.');
    const sessionPayload = JSON.parse(atob(sessionParts[1]));

    return {
      email: sessionPayload.email,
      name: sessionPayload.name,
      orig: sessionPayload.orig,
      sub: sessionPayload.sub,
      exp: sessionPayload.exp,
    };
  }

  /**
   * Method to get the full user object from the Corbado API.
   */
  async getCorbadoUser() {
    const resp = await this.#apiService.usersApi.currentUserGet();

    const me = resp.data.data as CorbadoUser;

    return me;
  }

  /** Method to set Session
   * It sets the short term session token, long term session token, and username for the Corbado Application.
   * @param shortSession The short term session token to be set.
   * @param longSession The long term session token to be set.
   */
  setSession(shortSession: ShortSession, longSession: string | undefined) {
    this.#setShortTermSessionToken(shortSession);
    this.#apiService.setInstanceWithToken(longSession ?? '');

    if (this.#onShortSessionChange) {
      this.#onShortSessionChange(shortSession);
    }

    this.#setLongSessionToken(longSession);
  }

  /**
   * Method to delete Session.
   * It deletes the short term session token, long term session token, and username for the Corbado Application.
   */
  clear() {
    this.#deleteShortTermSessionToken();
    this.#deleteLongSessionToken();

    if (this.#refreshIntervalId) {
      clearInterval(this.#refreshIntervalId);
    }
  }

  logout() {
    // TODO: should we call backend to destroy the session here?
    log.debug('logging out user');
    this.clear();

    if (this.#onShortSessionChange) {
      this.#onShortSessionChange(undefined);
    }
  }

  /**
   * Gets the short term session token.
   */
  static #getShortTermSessionToken(): ShortSession | undefined {
    const localStorageValue = localStorage.getItem(shortSessionKey);
    if (localStorageValue) {
      return new ShortSession(localStorageValue);
    }

    // we currently only add this here to be backwards compatible with the legacy webcomponent
    // the idea is that a user can log into an application that uses the legacy webcomponent
    // the webcomponent will set the short term session token in a cookie and this package can then take it from there
    // as soon as the legacy webcomponent is removed, this can be removed as well
    const cookieValue = this.#getCookieValue(shortSessionKey);
    if (cookieValue) {
      return new ShortSession(cookieValue);
    }

    return undefined;
  }

  static #getCookieValue(name: string): string | undefined {
    const regex = new RegExp(`(^| )${name}=([^;]+)`);
    const match = document.cookie.match(regex);
    if (match) {
      return match[2];
    }

    return undefined;
  }

  /**
   * Deletes the long term session token cookie for dev environment in localStorage.
   */
  #deleteLongSessionToken(): void {
    localStorage.removeItem(longSessionKey);
    this.#longSession = '';
  }

  /**
   * Gets the long term session token.
   */
  static #getLongSessionToken() {
    return (localStorage.getItem(longSessionKey) as string) ?? '';
  }

  /**
   * Sets a short term session token.
   * @param value
   */
  #setShortTermSessionToken(value: ShortSession): void {
    localStorage.setItem(shortSessionKey, value.toString());
    this.#shortSession = value;

    if (this.#setShortSessionCookie) {
      document.cookie = `${shortSessionKey}=${value.toString()}; path=/;`;
    }
  }

  /**
   * Deletes the short term session token.
   */
  #deleteShortTermSessionToken(): void {
    localStorage.removeItem(shortSessionKey);
    this.#shortSession = undefined;

    if (this.#setShortSessionCookie) {
      document.cookie = `${shortSessionKey}=; path=/; expires=${new Date().toUTCString()}`;
    }
  }

  /**
   * Sets a long term session token for dev environment in localStorage.
   * For production, it sets a cookie.
   */
  #setLongSessionToken(longSessionToken: string | undefined): void {
    if (!longSessionToken) {
      return;
    }

    localStorage.setItem(longSessionKey, longSessionToken);
    this.#longSession = longSessionToken;
  }

  async #handleRefreshRequest() {
    // no shortSession => user is not logged in => nothing to refresh
    if (!this.#shortSession) {
      log.debug('session refresh: no refresh, user not logged in');

      return;
    }

    // refresh, token too old
    if (!this.#shortSession.isValidForXMoreSeconds(shortSessionRefreshBeforeExpirationSeconds)) {
      await this.#refresh();
    }

    // nothing to do for now
    log.debug('no refresh, no refresh, token still valid');
    return;
  }

  async #refresh() {
    log.debug('session refresh: starting refresh');

    try {
      const options: AxiosRequestConfig = {
        headers: {
          Authorization: `Bearer ${this.#longSession}`,
        },
      };
      const response = await this.#apiService.sessionsApi.sessionRefresh({}, options);
      if (response.status !== 200) {
        log.warn(`refresh error, status code: ${response.status}`);
        return;
      }

      if (!response.data.shortSession?.value) {
        log.warn('refresh error, missing short session');
        return;
      }

      const shortSession = new ShortSession(response.data.shortSession?.value);
      this.setSession(shortSession, undefined);
    } catch (e) {
      // if it's a network error, we should do a retry
      // for all other errors, we should log out the user
      log.warn(e);
      this.logout();
    }
  }

  #handleVisibilityChange() {
    if (document.hidden) {
      log.debug('session refresh: no refresh, page is hidden');

      return;
    }

    try {
      void this.#handleRefreshRequest();
    } catch (e) {
      log.error(e);
    }
  }
}
