import './styles/index.css';

import addIcon from './assets/add.svg';
import appleIcon from './assets/apple.svg';
import cancelIcon from './assets/cancel.svg';
import changeIcon from './assets/change.svg';
import circleExclamationIcon from './assets/circle-exclamation.svg';
import copyIcon from './assets/copy.svg';
import deleteIcon from './assets/delete.svg';
import deviceIcon from './assets/device-icon.svg';
import editIcon from './assets/edit.svg';
import emailIcon from './assets/email.svg';
import emaiLinkSuccessIcon from './assets/email-link-success.svg';
import exclamationIcon from './assets/exclamation.svg';
import expandIcon from './assets/expand.svg';
import faceIdAndroid from './assets/face-id-android.svg';
import faceIdApple from './assets/face-id-apple.svg';
import faceIdDefault from './assets/face-id-default.svg';
import faceIdWindows from './assets/face-id-windows.svg';
import fingerprintAndroid from './assets/fingerprint-android.svg';
import fingerprintApple from './assets/fingerprint-apple.svg';
import fingerprintDefault from './assets/fingerprint-default.svg';
import fingerprintWindows from './assets/fingerprint-windows.svg';
import firstPageIcon from './assets/first-page.svg';
import githubIcon from './assets/github.svg';
import githubDarkIcon from './assets/github-dark.svg';
import gmailIcon from './assets/gmail.svg';
import googleIcon from './assets/google.svg';
import lockIcon from './assets/lock.svg';
import logoIcon from './assets/logo.svg';
import microsoftIcon from './assets/microsoft.svg';
import outlookIcon from './assets/outlook.svg';
import passkeyAppendAfterHybridIcon from './assets/passkey-append-after-hybrid.svg';
import passkeyAppendedIcon from './assets/passkey-appended.svg';
import passkeyDefaultIcon from './assets/passkey-default.svg';
import passkeyErrorIcon from './assets/passkey-error.svg';
import passkeyHybridIcon from './assets/passkey-hybrid.svg';
import passkeyHybridDarkIcon from './assets/passkey-hybrid-dark.svg';
import pendingIcon from './assets/pending.svg';
import personIcon from './assets/person.svg';
import phoneIcon from './assets/phone.svg';
import primaryIcon from './assets/primary.svg';
import rightIcon from './assets/right-arrow.svg';
import secureIcon from './assets/secure-icon.svg';
import shieldIcon from './assets/shield.svg';
import syncIcon from './assets/sync.svg';
import verifiedIcon from './assets/verified.svg';
import visibilityIcon from './assets/visibility.svg';
import yahooIcon from './assets/yahoo.svg';
import i18nDe from './i18n/de.json';
import i18nEn from './i18n/en.json';

export const i18n = {
  en: i18nEn,
  de: i18nDe,
};
export * from './utils';
export * from './flowHandler';
export type { BehaviorSubject } from 'rxjs';

export const assets = {
  rightIcon,
  deleteIcon,
  passkeyDefaultIcon,
  appleIcon,
  yahooIcon,
  gmailIcon,
  outlookIcon,
  editIcon,
  emailIcon,
  cancelIcon,
  logoIcon,
  circleExclamationIcon,
  exclamationIcon,
  passkeyErrorIcon,
  passkeyAppendedIcon,
  passkeyAppendAfterHybridIcon,
  secureIcon,
  deviceIcon,
  emaiLinkSuccessIcon,
  expandIcon,
  personIcon,
  phoneIcon,
  firstPageIcon,
  githubIcon,
  githubDarkIcon,
  googleIcon,
  microsoftIcon,
  shieldIcon,
  syncIcon,
  visibilityIcon,
  addIcon,
  faceIdDefault,
  fingerprintDefault,
  faceIdApple,
  fingerprintApple,
  faceIdAndroid,
  fingerprintAndroid,
  faceIdWindows,
  fingerprintWindows,
  passkeyHybridIcon,
  passkeyHybridDarkIcon,
  lockIcon,
  copyIcon,
  changeIcon,
  primaryIcon,
  verifiedIcon,
  pendingIcon,
};
