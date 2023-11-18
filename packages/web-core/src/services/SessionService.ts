import type {
  IFullUser,
  ISessionResponse,
  IShortSession,
  IShortSessionStore,
  IUser,
} from "../types";
import { ApiService } from "./ApiService";

const shortSessionKey = "cbo_short_session";
const longSessionKey = "cbo_long_session";

/**
 * The SessionService manages user sessions for the Corbado Application, handling short-term and long-term session tokens, and the username.
 * It offers methods to set, delete, and retrieve these tokens and the username,
 * as well as a method to fetch the full user object from the Corbado API.
 */
export class SessionService {
  #shortSession: IShortSessionStore | null = null;
  #longSession = "";
  #apiService: ApiService;
  #onSessionSetCallbacks: Array<(session: ISessionResponse) => void> = [];

  constructor(apiService: ApiService) {
    this.#apiService = apiService;
    this.#shortSession = SessionService.getShortTermSessionToken();
    this.#longSession = SessionService.getLongSessionToken();

    this.#apiService.setInstanceWithToken(this.#shortSession?.session ?? "");
  }

  /**
   * Method to check if the session is active.
   * @returns A boolean indicating whether the session is active.
   */
  static isSessionActive() {
    const shortSession = SessionService.getShortTermSessionToken();
    const longSession = SessionService.getLongSessionToken();

    const status =
      shortSession?.session &&
      Date.now() < new Date(shortSession.expires ?? "").getTime() &&
      longSession;

    if (!status) {
      localStorage.removeItem(shortSessionKey);
      localStorage.removeItem(longSessionKey);
    }

    return Boolean(status);
  }

  /**
   * Gets the long term session token.
   */
  static getLongSessionToken() {
    return (localStorage.getItem(longSessionKey) as string) ?? "";
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
   * Method to get the user object from the short term session token.
   * @param session The short term session token.
   * @returns The user object.
   */
  static getUserFromSession(session: IShortSessionStore | null) {
    if (!session?.session) {
      return null;
    }

    const sessionParts = session.session.split(".");
    const sessionPayload = JSON.parse(atob(sessionParts[1]));
    const user: IUser = {
      email: sessionPayload.email,
      name: sessionPayload.name,
      orig: sessionPayload.orig,
      sub: sessionPayload.sub,
    };

    return user;
  }

  /**
   * Method to get the full user object from the Corbado API.
   */
  static async getFullUser(projectId: string) {
    const apiService = new ApiService(projectId);
    const resp = await apiService.usersApi.currentUserGet();

    const me = resp.data.data as IFullUser;

    return me;
  }

  /**
   * Getter method for retrieving the short term session token.
   * @returns The short term session token or null if it's not set.
   */
  public get shortSession() {
    return this.#shortSession;
  }

  /**
   * Getter method for retrieving the long term session token.
   * @returns The long term session token or null if it's not set.
   */
  public get longSession() {
    return this.#longSession;
  }

  /**
   * Getter method for retrieving the user from short session.
   * @returns The username or null if it's not set.
   */
  public get user(): IUser | null {
    return SessionService.getUserFromSession(this.#shortSession);
  }

  /**
   * Method to add a callback function to be called when the session is set.
   */
  onSessionSet(cb: (session: ISessionResponse) => void) {
    this.#onSessionSetCallbacks.push(cb);
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

    this.#onSessionSetCallbacks.forEach((cb) => cb(sessionResponse));
  }

  /**
   * Method to delete Session.
   * It deletes the short term session token, long term session token, and username for the Corbado Application.
   */
  deleteSession() {
    this.#deleteShortTermSessionToken();
    this.#deleteLongSessionToken();
  }
}
