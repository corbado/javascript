/**
 * Configuration settings for a project.
 * @interface ProjectConfig
 * @property {boolean} allowUserRegistration - Indicates if user registration is allowed.
 * @property {string} passkeyAppendInterval - Interval for appending passkeys.
 * @property {string} fallbackLanguage - Default language to fall back to if detection fails or is not enabled.
 * @property {boolean} autoDetectLanguage - Determines if the language should be auto-detected.
 * @property {boolean} userFullNameRequired - Specifies if the full name of the user is required.
 * @property {boolean} webComponentDebug - Flag for enabling debug mode for web components.
 * @property {string} environment - The environment the project is running in (e.g., 'production', 'development').
 */
export interface ProjectConfig {
  allowUserRegistration: boolean;
  passkeyAppendInterval: string;
  fallbackLanguage: string;
  autoDetectLanguage: boolean;
  userFullNameRequired: boolean;
  webComponentDebug: boolean;
  environment: string;
}
