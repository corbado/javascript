import type { CorbadoAppParams } from './common';
import type { CustomThemes } from './theme';

/**
 * Interface for the properties accepted by the Corbado's exportable UI components.
 *
 * @interface CorbadoUIConfig
 * @property {string} [defaultLanguage] - The default language to be used if auto-detection is disabled or fails. Defaults to 'en' if not provided.
 * @property {boolean} [autoDetectLanguage] - A boolean indicating whether the user's language should be auto-detected. Defaults to true if not provided.
 * @property {Record<string, object> | null} [customTranslations] - An object containing custom translations. Each key should be a language code and each value should be an object containing the translations for that language.
 * @property {'on' | 'off' | 'auto'} [darkMode] - A string indicating the dark mode preference. Defaults to 'auto' if not provided.
 * @property {string | CustomThemes} [theme] - A string or an object indicating the theme preference. If it's a string, it should be a predefined theme name. If it's an object, it should be an CustomThemes object containing custom light and dark themes.
 * @property {string} [customerSupportEmail] - The email address to be used for customer support.
 * @property {boolean} [isDevMode] - A boolean indicating whether the app is running in development mode. Defaults to false if not provided.
 */
export interface CorbadoConfig extends CorbadoAppParams {
  defaultLanguage?: string;
  autoDetectLanguage?: boolean;
  customTranslations?: Record<string, object> | null;
  darkMode?: 'on' | 'off' | 'auto';
  theme?: string | CustomThemes;
  customerSupportEmail?: string;
  isDevMode?: boolean;
}

/**
 * Interface for the properties accepted by the Corbado's Auth components.
 *
 * @interface CorbadoAuthConfig
 * @property {() => void} onLoggedIn - A callback function that is called when the user is logged in.
 */
export interface CorbadoAuthConfig {
  onLoggedIn: () => void;
  handleNavigationEvents?: boolean;
}

/**
 * Interface for the properties accepted by the Corbado's Sign Up component.
 *
 * @interface CorbadoSignUpConfig
 * @property {() => void} onSignedUp - A callback function that is called when the user is signed up.
 * @property {() => void} [navigateToLogin] - A callback function that is called when the user clicks the login link. If not provided, the user will not be able to navigate to the login screen.
 */
export interface CorbadoSignUpConfig {
  onSignedUp: () => void;
  navigateToLogin?: () => void;
  handleNavigationEvents?: boolean;
}

/**
 * Interface for the properties accepted by the Corbado's Login component.
 *
 * @interface CorbadoLoginConfig
 * @property {() => void} onLoggedIn - A callback function that is called when the user is logged in.
 * @property {() => void} [navigateToSignUp] - A callback function that is called when the user clicks the sign up link. If not provided, the user will not be able to navigate to the sign up screen.
 */
export interface CorbadoLoginConfig {
  onLoggedIn: () => void;
  navigateToSignUp?: () => void;
  handleNavigationEvents?: boolean;
}
