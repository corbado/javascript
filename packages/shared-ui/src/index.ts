import './styles/index.css';
import './styles/error_page.css';
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

import deleteIcon from './assets/delete.svg';
import fingerprintIcon from './assets/fingerprint.svg';
import gmailIcon from './assets/gmail.svg';
import outlookIcon from './assets/outlook.svg';
import passkeyDefaultIcon from './assets/passkey-default.svg';
import yahooIcon from './assets/yahoo.svg';

export const assets = {
  deleteIcon,
  passkeyDefaultIcon,
  yahooIcon,
  gmailIcon,
  outlookIcon,
  fingerprintIcon,
};
