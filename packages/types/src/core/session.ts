/**
 * Enumeration of possible statuses.
 * @readonly
 * @enum {string}
 */
export const StatusEnum = {
  Active: 'active', // Represents an active status
  Pending: 'pending', // Represents a pending status
  Deleted: 'deleted', // Represents a deleted status
} as const; // Ensures that the properties of Status are readonly and their values are literal types.

/**
 * Type representing the allowed values of the Status enumeration.
 */
export type Status = (typeof StatusEnum)[keyof typeof StatusEnum]; // Type derived from the values of the Status object.

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
 * Represents an email associated with a user.
 * @interface UserEmail
 * @property {string} ID - Generic ID.
 * @property {string} email - Email address.
 * @property {string} created - Timestamp of creation in yyyy-MM-dd'T'HH:mm:ss format.
 * @property {string} updated - Timestamp of last update in yyyy-MM-dd'T'HH:mm:ss format.
 * @property {Status} status - Status of the email.
 */
export interface UserEmail {
  ID: string;
  email: string;
  created: string;
  updated: string;
  status: Status;
}

/**
 * Represents a phone number associated with a user.
 * @interface UserPhoneNumber
 * @property {string} ID - Generic ID.
 * @property {string} phoneNumber - Phone number.
 * @property {string} created - Timestamp of creation in yyyy-MM-dd'T'HH:mm:ss format.
 * @property {string} updated - Timestamp of last update in yyyy-MM-dd'T'HH:mm:ss format.
 * @property {Status} status - Status of the phone number.
 */
export interface UserPhoneNumber {
  ID: string;
  phoneNumber: string;
  created: string;
  updated: string;
  status: Status;
}

/**
 * Represents a full user with detailed information.
 * @interface CorbadoUser
 * @property {string} ID - ID of the user.
 * @property {string} name - Name of the user.
 * @property {string} fullName - Full name of the user.
 * @property {string} created - Timestamp of creation in yyyy-MM-dd'T'HH:mm:ss format.
 * @property {string} updated - Timestamp of last update in yyyy-MM-dd'T'HH:mm:ss format.
 * @property {Status} status - Status of the user.
 * @property {UserEmail[]} emails - Array of user's emails.
 * @property {UserPhoneNumber[]} phoneNumbers - Array of user's phone numbers.
 */
export interface CorbadoUser {
  ID: string;
  name: string;
  fullName: string;
  created: string;
  updated: string;
  status: Status;
  emails: UserEmail[];
  phoneNumbers: UserPhoneNumber[];
}
