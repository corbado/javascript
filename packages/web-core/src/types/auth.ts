import type { CookiesDefinition } from "./common";

/**
 * The response received from an authentication process.
 */
export interface IAuthResponse {
  /** Definition of the short-lived session cookies. */
  shortSession: CookiesDefinition;
  /** Unique identifier for the email link used in the authentication. */
  emailLinkID: string;
}

/**
 * Represents the structure of a short session cookie, excluding the 'name' property from CookiesDefinition.
 */
export interface IShortSession extends Omit<CookiesDefinition, "name"> {
  /** The key name of the cookie, replacing the omitted 'name' property. */
  key: string;
}

/**
 * Enumeration of possible statuses.
 */
export const Status = {
  Active: "active",
  Pending: "pending",
  Deleted: "deleted",
} as const; // Ensures that the properties of Status are readonly and their values are literal types.

/**
 * Type representing the allowed values of the Status enumeration.
 */
export type Status = (typeof Status)[keyof typeof Status]; // Type derived from the values of the Status object.

/**
 * Represents an email associated with a user.
 */
export interface IUserEmail {
  /** Generic ID */
  ID: string;
  /** Email address */
  email: string;
  /** Timestamp of creation in yyyy-MM-dd'T'HH:mm:ss format */
  created: string;
  /** Timestamp of last update in yyyy-MM-dd'T'HH:mm:ss format */
  updated: string;
  /** Status of the email */
  status: Status;
}

/**
 * Represents a phone number associated with a user.
 */
export interface IUserPhoneNumber {
  /** Generic ID */
  ID: string;
  /** Phone number */
  phoneNumber: string;
  /** Timestamp of creation in yyyy-MM-dd'T'HH:mm:ss format */
  created: string;
  /** Timestamp of last update in yyyy-MM-dd'T'HH:mm:ss format */
  updated: string;
  /** Status of the phone number */
  status: Status;
}

/**
 * Represents a full user with detailed information.
 */
export interface IFullUser {
  /** ID of the user */
  ID: string;
  /** Name of the user */
  name: string;
  /** Full name of the user */
  fullName: string;
  /** Timestamp of creation in yyyy-MM-dd'T'HH:mm:ss format */
  created: string;
  /** Timestamp of last update in yyyy-MM-dd'T'HH:mm:ss format */
  updated: string;
  /** Status of the user */
  status: Status;
  /** Array of user's emails */
  emails: IUserEmail[];
  /** Array of user's phone numbers */
  phoneNumbers: IUserPhoneNumber[];
}
