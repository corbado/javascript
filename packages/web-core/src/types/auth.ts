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
