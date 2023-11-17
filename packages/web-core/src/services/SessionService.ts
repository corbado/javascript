import type {
  IFullUser,
  ISessionResponse,
  IShortSession,
  IShortSessionStore,
} from "../types";
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
  #shortSession: IShortSessionStore | null = null;
  #longSession = "";
  #user = "";
  #apiService: ApiService;

  constructor(apiService: ApiService) {
    this.#apiService = apiService;
    this.#shortSession = SessionService.getShortTermSessionToken();
    this.#longSession = SessionService.getLongSessionToken();
    this.#user = SessionService.getUser();

    this.#apiService.setInstanceWithToken(this.#shortSession?.session ?? "");
  }

  /**
   * Getter method for retrieving the short term session token.
   * @returns The short term session token or null if it's not set.
   */
  get shortSession() {
    return this.#shortSession;
  }

  /**
   * Getter method for retrieving the long term session token.
   * @returns The long term session token or null if it's not set.
   */
  get longSession() {
    return this.#longSession;
  }

  /**
   * Getter method for retrieving the username.
   * @returns The username or null if it's not set.
   */
  get user() {
    return this.#user;
  }

  /**
   * Sets a long term session token for dev environment in localStorage.
   * For production, it sets a cookie.
   */
  #setLongSessionToken(longSessionToken: string): void {
    localStorage.setItem(longSessionKey, longSessionToken);
    this.#longSession = longSessionToken;
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
  static getLongSessionToken() {
    return (localStorage.getItem(longSessionKey) as string) ?? "";
  }

  /**
   * Sets a short term session token.
   * @param session The session token to be set.
   */
  #setShortTermSessionToken(session: IShortSession): void {
    const store: IShortSessionStore = {
      session: session.value ?? "",
      expires: session.expires ?? "",
    };
    localStorage.setItem(shortSessionKey, JSON.stringify(store));
    this.#shortSession = session;
  }

  /**
   * Deletes the short term session token.
   */
  #deleteShortTermSessionToken(): void {
    localStorage.removeItem(shortSessionKey);
    this.#shortSession = null;
  }

  /**
   * Gets the short term session token.
   */
  static getShortTermSessionToken() {
    const storedSessionStr = localStorage.getItem(shortSessionKey);

    return storedSessionStr
      ? (JSON.parse(storedSessionStr) as IShortSessionStore)
      : null;
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
  static getUser() {
    return (localStorage.getItem(userKey) as string) ?? "";
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
  setSession(sessionResponse: ISessionResponse) {
    if (sessionResponse.shortSession) {
      this.#setShortTermSessionToken(sessionResponse.shortSession);
      this.#apiService.setInstanceWithToken(
        sessionResponse.shortSession.value ?? ""
      );
    }

    this.#setLongSessionToken(sessionResponse.longSession ?? "");
    this.#setUser(sessionResponse.user ?? "");
  }

  /**
   * Method to delete Session.
   * It deletes the short term session token, long term session token, and username for the Corbado Application.
   */
  deleteSession() {
    this.#deleteShortTermSessionToken();
    this.#deleteLongSessionToken();
    this.#deleteUser();
  }
}
