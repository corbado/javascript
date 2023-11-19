import type {IFullUser, ISessionResponse, IShortSession, IShortSessionStore, IUser,} from "../types";
import type {ApiService} from "./ApiService";

const shortSessionKey = "cbo_short_session";
const longSessionKey = "cbo_long_session";

/**
 * The SessionService manages user sessions for the Corbado Application, handling short-term and long-term session tokens, and the username.
 * It offers methods to set, delete, and retrieve these tokens and the username,
 * as well as a method to fetch the full user object from the Corbado API.
 */
export class SessionService {
    #shortSession: IShortSessionStore | null = null;
    // @ts-ignore
    #longSession = "";
    #apiService: ApiService;
    #onShortSessionChange?: (s: IShortSessionStore) => void

    constructor(apiService: ApiService) {
        this.#apiService = apiService
    }

    init(onShortSessionChange: (s: IShortSessionStore) => void) {
        this.#onShortSessionChange = onShortSessionChange

        const shortSession = SessionService.getShortTermSessionToken();
        this.#shortSession = shortSession
        this.#longSession = SessionService.getLongSessionToken()

        this.#apiService.setInstanceWithToken(this.#shortSession?.session ?? "")

        if (shortSession) {
            this.#onShortSessionChange(shortSession)
        }
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
        if (!this.#shortSession?.session) {
            return;
        }

        const sessionParts = this.#shortSession.session.split(".");
        console.log(sessionParts)
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
        this.#shortSession = store;
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

            if (this.#onShortSessionChange) {
                this.#onShortSessionChange(sessionResponse.shortSession)
            }
        }

        this.#setLongSessionToken(sessionResponse.longSession ?? "");
    }

    /**
     * Method to delete Session.
     * It deletes the short term session token, long term session token, and username for the Corbado Application.
     */
    clear() {
        this.#deleteShortTermSessionToken();
        this.#deleteLongSessionToken();
    }
}
