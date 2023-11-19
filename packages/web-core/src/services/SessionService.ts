import type {IFullUser, IUser,} from "../types";
import {ShortSession} from "../types";
import type {ApiService} from "./ApiService";
import {AxiosRequestConfig} from "axios";

const shortSessionKey = "cbo_short_session";
const longSessionKey = "cbo_long_session";
const shortSessionRefreshBeforeExpirationSeconds = 280
const shortSessionRefreshIntervalMs = 10_000

/**
 * The SessionService manages user sessions for the Corbado Application, handling shortSession and longSession.
 * It offers methods to set, delete, and retrieve these tokens and the username,
 * as well as a method to fetch the full user object from the Corbado API.
 *
 * The longSession should not be exposed from this service as it is only used for session refresh.
 */
export class SessionService {
  #shortSession: ShortSession | undefined
  #longSession: string | undefined
  #apiService: ApiService;
  #onShortSessionChange?: (value: ShortSession|undefined) => void
  #refreshIntervalId: NodeJS.Timeout | undefined;

  constructor(apiService: ApiService) {
    this.#apiService = apiService
    this.#longSession = undefined
  }

  init(onShortSessionChange: (value: ShortSession|undefined) => void) {
    this.#onShortSessionChange = onShortSessionChange

    const shortSession = SessionService.#getShortTermSessionToken();
    if (shortSession) {
      this.#shortSession = shortSession
      this.#onShortSessionChange(shortSession)
      this.#apiService.setInstanceWithToken(shortSession.value)
    }

    this.#longSession = SessionService.#getLongSessionToken()

    // init scheduled session refresh
    this.#refreshIntervalId = setInterval(async () => {
      await this.#handleRefreshRequest()
    }, shortSessionRefreshIntervalMs)
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
  public getUser(): IUser | undefined {
    console.log(this.#shortSession)
    if (!this.#shortSession) {
      return;
    }

    const sessionParts = this.#shortSession.value.split(".");
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
  async getFullUser() {
    const resp = await this.#apiService.usersApi.currentUserGet();

    const me = resp.data.data as IFullUser;

    return me;
  }

  /** Method to set Session
   * It sets the short term session token, long term session token, and username for the Corbado Application.
   * @param shortSession The short term session token to be set.
   * @param longSession The long term session token to be set.
   */
  setSession(shortSession: ShortSession, longSession: string | undefined) {
    this.#setShortTermSessionToken(shortSession)
    this.#apiService.setInstanceWithToken(shortSession.value)

    if (this.#onShortSessionChange) {
      this.#onShortSessionChange(shortSession)
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
      clearInterval(this.#refreshIntervalId)
    }
  }

  async logout() {
    // TODO: should we call backend to destroy the session here?
    console.log('logging out user')
    this.clear();

    if (this.#onShortSessionChange) {
      this.#onShortSessionChange(undefined)
    }
  }

  /**
   * Gets the short term session token.
   */
  static #getShortTermSessionToken(): ShortSession | undefined {
    const v = localStorage.getItem(shortSessionKey)
    if (!v) {
      return
    }

    return new ShortSession(v)
  }

  /**
   * Deletes the long term session token cookie for dev environment in localStorage.
   */
  #deleteLongSessionToken(): void {
    localStorage.removeItem(longSessionKey);
    this.#longSession = "";
  }

  /**
   * Gets the long term session token.
   */
  static #getLongSessionToken() {
    return (localStorage.getItem(longSessionKey) as string) ?? "";
  }

  /**
   * Sets a short term session token.
   * @param value
   */
  #setShortTermSessionToken(value: ShortSession): void {
    localStorage.setItem(shortSessionKey, value.toString());
    this.#shortSession = value;
  }

  /**
   * Deletes the short term session token.
   */
  #deleteShortTermSessionToken(): void {
    localStorage.removeItem(shortSessionKey);
    this.#shortSession = undefined;
  }

  /**
   * Sets a long term session token for dev environment in localStorage.
   * For production, it sets a cookie.
   */
  #setLongSessionToken(longSessionToken: string | undefined): void {
    if (!longSessionToken) {
      return
    }

    localStorage.setItem(longSessionKey, longSessionToken);
    this.#longSession = longSessionToken;
  }

  async #handleRefreshRequest() {
    // no shortSession => user is not logged in => nothing to refresh
    if (!this.#shortSession) {
      return
    }

    // refresh, token too old
    if (!this.#shortSession.isValidForXMoreSeconds(shortSessionRefreshBeforeExpirationSeconds)) {
      await this.#refresh()
    }

    // nothing to do for now
    console.log('no refresh, token still valid')
    return
  }

  async #refresh() {
    try {
      const options: AxiosRequestConfig = {
        headers: {
          'Authorization': 'Bearer ' + this.#longSession
        }
      }
      const response = await this.#apiService.sessionsApi.sessionRefresh({}, options)
      if (response.status !== 200) {
        console.error('refresh error, status code: ' + response.status)
        return
      }

      if (!response.data.shortSession?.value) {
        console.error('refresh error, missing short session')
        return
      }

      const shortSession = new ShortSession(response.data.shortSession?.value)
      this.setSession(shortSession, undefined)
    } catch (e) {
      // if it's a network error, we should do a retry
      // for all other errors, we should log out the user
      console.log(e)
      await this.logout()
    }
  }
}
