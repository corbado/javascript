import './styles/index.css';
import './styles/error_page.css';
import './styles/themes/dark.css';
import './styles/themes/emerald-funk.css';
import './styles2/index.css';

import cancelIcon from './assets/cancel.svg';
import circleExclamationIcon from './assets/circle-exclamation.svg';
import deleteIcon from './assets/delete.svg';
import deviceIcon from './assets/device-icon.svg';
import editIcon from './assets/edit.svg';
import emailIcon from './assets/email.svg';
import emaiLinkSuccessIcon from './assets/email-link-success.svg';
import exclamationIcon from './assets/exclamation.svg';
import faceId from './assets/face-id.svg';
import fingerprintIcon from './assets/fingerprint.svg';
import gmailIcon from './assets/gmail.svg';
import logoIcon from './assets/logo.svg';
import outlookIcon from './assets/outlook.svg';
import passkeyAppendedIcon from './assets/passkey-appended.svg';
import passkeyDefaultIcon from './assets/passkey-default.svg';
import passkeyErrorIcon from './assets/passkey-error.svg';
import secureIcon from './assets/secure-icon.svg';
import yahooIcon from './assets/yahoo.svg';
import i18nDe from './i18n/de.json';
import i18nEn from './i18n/en.json';

export const i18n = {
  en: i18nEn,
  de: i18nDe,
};
export * from './utils';
export * from './flowHandler';

export const assets = {
  deleteIcon,
  passkeyDefaultIcon,
  yahooIcon,
  gmailIcon,
  outlookIcon,
  editIcon,
  emailIcon,
  faceId,
  fingerprintIcon,
  cancelIcon,
  logoIcon,
  circleExclamationIcon,
  exclamationIcon,
  passkeyErrorIcon,
  passkeyAppendedIcon,
  secureIcon,
  deviceIcon,
  emaiLinkSuccessIcon,
};
