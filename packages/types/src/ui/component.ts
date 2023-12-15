import type { CustomThemes } from './theme';

/**
 * Interface for the properties accepted by the CorbadoAuthUI component.
 *
 * @interface CorbadoAuthUIProps
 * @property {() => void} onLoggedIn - A callback function that is called when the user is logged in.
 * @property {string} [defaultLanguage] - The default language to be used if auto-detection is disabled or fails. Defaults to 'en' if not provided.
 * @property {boolean} [autoDetectLanguage] - A boolean indicating whether the user's language should be auto-detected. Defaults to true if not provided.
 * @property {Record<string, object> | null} [customTranslations] - An object containing custom translations. Each key should be a language code and each value should be an object containing the translations for that language.
 * @property {'on' | 'off' | 'auto'} [darkMode] - A string indicating the dark mode preference. Defaults to 'auto' if not provided.
 * @property {string | CustomThemes} [theme] - A string or an object indicating the theme preference. If it's a string, it should be a predefined theme name. If it's an object, it should be an CustomThemes object containing custom light and dark themes.
 */
export interface CorbadoAuthUIProps {
  onLoggedIn: () => void;
  defaultLanguage?: string;
  autoDetectLanguage?: boolean;
  customTranslations?: Record<string, object> | null;
  darkMode?: 'on' | 'off' | 'auto';
  theme?: string | CustomThemes;
  isDevMode?: boolean;
  customerSupportEmail?: string;
}
