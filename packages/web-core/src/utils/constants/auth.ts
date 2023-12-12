/**
 * Enum representing the authentication state of a user.
 * @enum {number}
 * @property {number} LoggedOut - The user is not authenticated.
 * @property {number} LoggedIn - The user is authenticated.
 */
export enum AuthState {
  LoggedOut,
  LoggedIn,
}
