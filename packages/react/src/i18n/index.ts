import { i18n as i18nTranslations } from '@corbado/shared-ui';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

export const defaultLanguage = 'en';

void i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources: {
      en: { translation: i18nTranslations.en },
      de: { translation: i18nTranslations.de },
    },
    keySeparator: '.',
    fallbackLng: defaultLanguage,
  });

/**
 * @function getLanguage Extract language from a locale
 *
 * @param {string} locale The locale passed in the function e.g `de-DE`, `en-GB`
 * @return {*} {string} The language extracted from the locale e.g `de`, `en`
 */
const getLanguage = (locale: string): string => locale.split('-')[0];

/**
 * @function setI18nLanguage Sets any language passed in the parameters to the html document body.
 *
 * @param {string} lang - The language to be set in the html element of the DOM e.g `de`, `en`
 * @return {*} void
 */
const setI18nLanguage = (lang: string): void => {
  document?.querySelector('html')?.setAttribute('lang', lang);
};

/**
 * @function handleDynamicLocaleSetup An async function that handles setting the language of the user to the preferred locale.
 *
 * @param {boolean} [shouldAutoDetectLanguage=true] This is a boolean that determines if the language of the user should be auto detected. It defaults to true if no value is passed.
 * @param {string} [defaultLang=defaultLanguage] This is the default language to be used if the language of the user cannot be auto detected. It defaults to `en` if no value is passed.
 * @param {object} [customTranslations={}] This is an object containing custom translations. Each key should be a language code and each value should be an object containing the translations for that language.
 * @return {*} Promise<void>
 */
export const handleDynamicLocaleSetup = (
  shouldAutoDetectLanguage = true,
  defaultLang = defaultLanguage,
  customTranslations: Record<string, object> | null = null,
) => {
  const locale = window.navigator.language;

  // If the language of the user is the same as the default language and there are no custom translations, do nothing
  if (
    shouldAutoDetectLanguage &&
    defaultLang === defaultLanguage &&
    locale === defaultLanguage &&
    !customTranslations
  ) {
    return;
  }

  // Add custom translations
  for (const [lang, translations] of Object.entries(customTranslations ?? {})) {
    i18n.addResourceBundle(lang, 'translation', translations, true, true);
  }

  const language = shouldAutoDetectLanguage ? getLanguage(locale) : defaultLang;
  try {
    void i18n.changeLanguage(language);
    setI18nLanguage(language);
  } catch {
    void i18n.changeLanguage(defaultLang);
    setI18nLanguage(defaultLang);
  }
};

export default i18n;
