/* eslint-disable @typescript-eslint/no-var-requires */
import './styles/index.css';
import './styles/themes/dark.css';
import './styles/themes/emerald-funk.css';

import i18nDe from './i18n/de.json';
import i18nEn from './i18n/en.json';

export const i18n = {
  en: i18nEn,
  de: i18nDe,
};
export * from './utils';
export * from './flowHandler';
export const deleteSVG = require('./assets/delete.svg');
export const gmailSVG = require('./assets/gmail.svg');
export const outlookSVG = require('./assets/outlook.svg');
export const yahooSVG = require('./assets/yahoo.svg');
