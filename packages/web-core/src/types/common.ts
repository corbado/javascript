import type { AssetsApi, ProjectsApi, SessionsApi, UsersApi } from "../api";

/**
 * Defines the structure and options for a cookie.
 */
export type CookiesDefinition = {
  /** The name of the cookie. */
  name: string;
  /** The value stored in the cookie. */
  value: string;
  /** Expiration time or date of the cookie. Optional. */
  expires?: number | Date;
  /** The path for which the cookie is valid. Optional. */
  path?: string;
  /** The domain for which the cookie is valid. Optional. */
  domain?: string;
  /** Flag to specify if the cookie transmission requires a secure protocol (HTTPS). Optional. */
  secure?: boolean;
  /** SameSite attribute of the cookie to assert control over cross-site requests. Optional. */
  sameSite?: "strict" | "Strict" | "lax" | "Lax" | "none" | "None";
};

/**
 * Provides access to various APIs related to the service.
 */
export interface IApiService {
  /** API for user-related operations. */
  usersApi: UsersApi;
  /** API for asset-related operations. */
  assetsApi: AssetsApi;
  /** API for project-related operations. */
  projectsApi: ProjectsApi;
  /** API for session-related operations. */
  sessionsApi: SessionsApi;
}

/**
 * Configuration settings for a project.
 */
export interface IProjectConfig {
  /** Indicates if user registration is allowed. */
  allowUserRegistration: boolean;
  /** Interval for appending passkeys. */
  passkeyAppendInterval: string;
  /** Default language to fall back to if detection fails or is not enabled. */
  fallbackLanguage: string;
  /** Determines if the language should be auto-detected. */
  autoDetectLanguage: boolean;
  /** Specifies if the full name of the user is required. */
  userFullNameRequired: boolean;
  /** Flag for enabling debug mode for web components. */
  webComponentDebug: boolean;
  /** The environment the project is running in (e.g., 'production', 'development'). */
  environment: string;
}
