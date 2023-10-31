import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import TRANSLATIONS_EN from './locales/en';

const defaultLanguage = 'en';

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources: {
      en: { translation: TRANSLATIONS_EN },
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
 * @param {*} [locale=navigator.language] This is the locale a user wants to set. It deefaults to the locale of the user's browser if no value is padded. e.g `de-DE`, `en-GB`
 * @return {*} Promise<void>
 */
export const handleDynamicLocaleSetup = async (locale = navigator.language): Promise<void> => {
  const lang = getLanguage(locale.substring(0, 2));
  try {
    i18n.changeLanguage(lang);
    setI18nLanguage(lang);
  } catch {
    i18n.changeLanguage(defaultLanguage);
    setI18nLanguage(defaultLanguage);
  }
};

export default i18n;