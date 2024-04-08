/**
 * Type representing the allowed values of the Status enumeration.
 */
export type Status = 'active' | 'pending' | 'deleted'; // Type derived from the values of the Status object.

/**
 * Represents a user from JWT token.
 * @interface SessionUser
 * @property {string} email - User's email.
 * @property {string} name - User's name.
 * @property {string} orig - User's origin.
 * @property {string} sub - User's ID.
 * @property {number} exp - Expiration time.
 */
export interface SessionUser {
  email: string;
  name: string;
  orig: string;
  sub: string;
  exp: number;
}

/**
 * Interface for CorbadoUser.
 * @interface
 * @property {string} id - The unique identifier for the user.
 * @property {string} fullName - The full name of the user.
 * @property {Array<Identifier>} identifiers - The array of identifiers for the user.
 */
export interface CorbadoUser {
  id: string;
  fullName: string;
  identifiers: Array<Identifier>;
}

/**
 * Interface for Identifier.
 * @interface
 * @property {string} value - The value of the identifier.
 * @property {LoginIdentifierType} type - The type of the identifier.
 * @property {string} status - The status of the identifier.
 */
export interface Identifier {
  value: string;
  type: LoginIdentifierType;
  status: string;
}

/**
 * Object for LoginIdentifierType.
 * @typedef {Object} LoginIdentifierType
 * @property {string} Email - Represents an email identifier.
 * @property {string} Phone - Represents a phone identifier.
 * @property {string} Username - Represents a username identifier.
 */
export const LoginIdentifierType = {
  Email: 'email',
  Phone: 'phone',
  Username: 'username',
} as const;

/**
 * Type for LoginIdentifierType.
 * @typedef {string} LoginIdentifierType
 */
export type LoginIdentifierType = (typeof LoginIdentifierType)[keyof typeof LoginIdentifierType];
