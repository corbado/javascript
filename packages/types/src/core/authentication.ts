/**
 * Type representing the different methods a user can use to authenticate.
 * @typedef {('email' | 'phone_number' | 'webauthn' | 'password')} AuthMethod
 */

export type AuthMethod = 'email' | 'phone_number' | 'webauthn' | 'password';

/**
 * Interface representing the authentication methods a user has selected and can possibly use.
 * @interface UserAuthMethods
 * @property {Array<AuthMethod>} selectedMethods - An array of methods the user has selected for authentication.
 * @property {Array<AuthMethod>} possibleMethods - An array of methods the user can possibly use for authentication.
 */
export interface UserAuthMethods {
  selectedMethods: Array<AuthMethod>;
  possibleMethods: Array<AuthMethod>;
}
