//TODO: make the properties compulsory and remove the question mark (waiting on BE support)
/**
 * Options for the login flow.
 * @interface LoginFlowOptions
 * @property {boolean} passkeyAppend - Whether to append a passkey.
 * @property {boolean} retryPasskeyOnError - Whether to retry passkey on error.
 */
export interface LoginFlowOptions {
  passkeyAppend?: boolean;
  retryPasskeyOnError?: boolean;
}

//TODO: make the properties compulsory and remove the question mark (waiting on BE support)
/**
 * Options for the signup flow.
 * @interface SignupFlowOptions
 * @property {boolean} passkeyAppend - Whether to append a passkey.
 * @property {boolean} retryPasskeyOnError - Whether to retry passkey on error.
 */
export interface SignupFlowOptions {
  passkeyAppend?: boolean;
  retryPasskeyOnError?: boolean;
}

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
 * @property {string} loginFlow - The flow to use for user login.
 * @property {LoginFlowOptions} loginFlowOptions - Options for the login flow.
 * @property {string} signupFlow - The flow to use for user signup.
 * @property {SignupFlowOptions} signupFlowOptions - Options for the signup flow.
 */
export interface ProjectConfig {
  allowUserRegistration: boolean;
  passkeyAppendInterval: string;
  fallbackLanguage: string;
  autoDetectLanguage: boolean;
  userFullNameRequired: boolean;
  webComponentDebug: boolean;
  environment: string;
  loginFlow: string;
  loginFlowOptions: LoginFlowOptions;
  signupFlow: string;
  signupFlowOptions: SignupFlowOptions;
}
