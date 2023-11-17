import type { IFullUser } from "../types";
import type { ApiService } from "./ApiService";

const shortSessionKey = "cbo_short_session";
const longSessionKey = "cbo_long_session";
const userKey = "cbo_user";

/**
 * The SessionService manages user sessions for the Corbado Application, handling short-term and long-term session tokens, and the username.
 * It offers methods to set, delete, and retrieve these tokens and the username,
 * as well as a method to fetch the full user object from the Corbado API.
 */
export class SessionService {
  #shortSession = "";
  #longSession = "";
  #user = "";
  #apiService: ApiService;

  constructor(apiService: ApiService) {
    this.#apiService = apiService;
    this.#shortSession = this.getShortTermSessionToken();
    this.#longSession = this.getLongTermSessionToken();
    this.#user = this.getUser();
  }

  /**
   * Sets a long term session token for dev environment in localStorage.
   * For production, it sets a cookie.
   */
  #setLongTermSessionToken(longSessionToken: string): void {
    localStorage.setItem(longSessionKey, longSessionToken);
    this.#longSession = longSessionToken;
  }

  /**
   * Deletes the long term session token cookie for dev environment in localStorage.
   */
  #deleteLongTermSessionToken(): void {
    localStorage.removeItem(longSessionKey);
    this.#longSession = "";
  }

  /**
   * Gets the long term session token.
   */
  getLongTermSessionToken(): string {
    return this.#longSession || (localStorage.getItem(longSessionKey) ?? "");
  }

  /**
   * Sets a short term session token.
   * @param session The session token to be set.
   */
  #setShortTermSessionToken(session: string): void {
    localStorage.setItem(shortSessionKey, session);
    this.#shortSession = session;
  }

  /**
   * Deletes the short term session token.
   */
  #deleteShortTermSessionToken(): void {
    localStorage.removeItem(shortSessionKey);
    this.#shortSession = "";
  }

  /**
   * Gets the short term session token.
   */
  getShortTermSessionToken(): string {
    return this.#shortSession || (localStorage.getItem(shortSessionKey) ?? "");
  }

  /**
   * Sets the username in localStorage.
   * @param user The username to be set.
   */
  #setUser(username: string): void {
    localStorage.setItem(userKey, username);
    this.#user = username;
  }

  /**
   * Deletes the username from localStorage.
   */
  #deleteUser(): void {
    localStorage.removeItem(userKey);
    this.#user = "";
  }

  /**
   * Gets the username from localStorage.
   */
  getUser(): string {
    return this.#user || (localStorage.getItem(userKey) ?? "");
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
   * @param user The username to be set.
   */
  setSession(shortSession: string, longSession: string, user: string) {
    this.#setShortTermSessionToken(shortSession);
    this.#setLongTermSessionToken(longSession);
    this.#setUser(user);

    this.#apiService.setInstanceWithToken(shortSession ?? "");
  }

  /**
   * Method to delete Session
   * It deletes the short term session token, long term session token, and username for the Corbado Application.
   */
  deleteSession() {
    this.#deleteShortTermSessionToken();
    this.#deleteLongTermSessionToken();
    this.#deleteUser();
  }
}
