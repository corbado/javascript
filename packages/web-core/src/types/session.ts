import type {CookiesDefinition} from "./common";

/**
 * Represents the structure of a short session cookie, excluding the 'name' property from CookiesDefinition.
 */
export interface IShortSession
  extends Omit<CookiesDefinition, "name" | "expires" | "sameSite"> {
  /** The key name of the cookie, replacing the omitted 'name' property. */
  key: string;
  /** The expiration date of the cookie in ISO 8601 format. */
  expires: string;
  /** The SameSite attribute of the cookie. */
  sameSite: string;
}

export interface ISessionResponse {
  /** The short session cookie. */
  shortSession?: IShortSession;
  /** The long session token. */
  longSession?: string;
  /** The user email. */
  user?: string;
  /** The redirect URL which can be used to redirect on successful authentication */
  redirectUrl?: string;
}

/**
 * Enumeration of possible statuses.
 */
export const StatusEnum = {
  Active: "active",
  Pending: "pending",
  Deleted: "deleted",
} as const; // Ensures that the properties of Status are readonly and their values are literal types.

/**
 * Type representing the allowed values of the Status enumeration.
 */
export type Status = (typeof StatusEnum)[keyof typeof StatusEnum]; // Type derived from the values of the Status object.

/**
 * Represents a user from JWT token.
 */
export interface IUser {
  /** User Email */
  email: string
  /** User Name */
  name: string
  /** User Origin */
  orig: string
  /** User ID */
  sub: string
  exp: number
}

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


export class ShortSession {
  readonly #value: string
  readonly #user: IUser

  constructor(value: string) {
    this.#value = value

    // this is a quick and easy way to parse JWT tokens without using a library
    const splits = value.split(".")
    this.#user = JSON.parse(atob(splits[1]))
  }

  get value() {
    return this.#value
  }

  get user() {
    return this.#user
  }

  isValidForXMoreSeconds(seconds: number): boolean {
    const now = new Date().getTime() / 1000

    return this.#user.exp > now + seconds
  }

  toString(): string {
    return this.#value
  }
}
